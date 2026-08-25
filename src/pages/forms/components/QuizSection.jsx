import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../../services/api';
import { ENGLISH_QUESTIONS } from '../formShared';
import {
  HOS_CORRECT,
  HOS_QUESTIONS,
  PRETRIP_CORRECT,
  PRETRIP_QUESTIONS,
  QUIZ_META,
  TRAFFIC_CORRECT,
  TRAFFIC_QUESTIONS,
} from '../quizData';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCompletedOn(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .format(new Date(iso))
      .replace(',', '');
  } catch {
    return String(iso);
  }
}

/** Admin review — show user's answers with correct/incorrect (original edit-form modal) */
function QuizResultsModal({ title, test, questions, correctMap, valueMode = 'label', onClose }) {
  const score = `${test.correct_answers}/${test.total_questions} (${Number(test.score_percentage).toFixed(1)}%)`;

  return (
    <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white justify-content-between align-items-center">
            <h5 className="modal-title text-white mb-0">
              {title} <span className="badge bg-success ms-2">Completed</span>
            </h5>
            <div className="d-flex align-items-center gap-3">
              <div className="text-white">
                <strong>Score: {score}</strong>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>
          </div>
          <div className="modal-body p-4">
            <div className="row">
              {questions.map((q, qi) => {
                const userAnswer = test[q.key];
                const correctAnswer = correctMap?.[q.key];
                return (
                  <div className="col-md-6 mb-3" key={q.key}>
                    <div className="question-block p-3 border rounded h-100">
                      <label className="form-label fw-bold mb-3 d-block">
                        {qi + 1}. {String(q.text).replace(/^\d+\.\s*/, '')}
                      </label>
                      {q.image ? <img src={q.image} alt="" className="quizimg" /> : null}
                      {q.options.map((opt, oi) => {
                        const value = valueMode === 'index' ? opt.value : typeof opt === 'string' ? opt : opt.label;
                        const label = typeof opt === 'string' ? opt : opt.label;
                        const isSelected = String(userAnswer) === String(value);
                        const isCorrectOption = String(correctAnswer) === String(value);
                        let rowClass = '';
                        if (isSelected && isCorrectOption) rowClass = 'correct-answer';
                        else if (isSelected && !isCorrectOption) rowClass = 'incorrect-answer';
                        return (
                          <div className={`form-check ${rowClass}`} key={`${q.key}_${oi}`}>
                            <input
                              className="form-check-input"
                              type="radio"
                              disabled
                              checked={isSelected}
                              readOnly
                            />
                            <label className="form-check-label">
                              {label}
                              {isSelected && isCorrectOption ? (
                                <span className="text-success ms-2 fw-bold">✓</span>
                              ) : null}
                              {isSelected && !isCorrectOption ? (
                                <span className="text-danger ms-2 fw-bold">✗</span>
                              ) : null}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnglishResultsModal({ title, test, onClose }) {
  return (
    <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white justify-content-between align-items-center">
            <h5 className="modal-title text-white mb-0">
              {title} <span className="badge bg-success ms-2">Completed</span>
            </h5>
            <div className="d-flex align-items-center gap-3">
              <div className="text-white">
                <strong>
                  Score: {test.correct_answers}/{test.total_questions} ({Number(test.score_percentage).toFixed(1)}%)
                </strong>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>
          </div>
          <div className="modal-body p-4">
            <div className="row">
              {ENGLISH_QUESTIONS.map(([fn, fl]) => (
                <div className="col-md-6 mb-3" key={fn}>
                  <div className="field">
                    <label className="field-label">{fl}</label>
                    <input className="field-input" value={test[fn] || ''} readOnly />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One-question-at-a-time wizard — matches original ModalTimer / question-step UI */
function TimedQuizModal({
  title,
  durationMin,
  questions,
  valueMode = 'label',
  metaFields,
  onClose,
  onSubmit,
  saving,
}) {
  const total = questions.length;
  const totalSec = durationMin * 60;
  const [step, setStep] = useState(1);
  const [left, setLeft] = useState(totalSec);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const startedAt = useRef(Date.now());
  const submitted = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  const advanceTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (left !== 0 || submitted.current) return;
    submitted.current = true;
    window.alert('Time is up! The quiz will be submitted automatically.');
    const timeTaken = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    onSubmitRef.current(answersRef.current, timeTaken);
  }, [left]);

  const setAnswer = (key, val) => {
    setAnswers((p) => {
      const next = { ...p, [key]: val };
      answersRef.current = next;
      return next;
    });
  };

  const goStep = (n) => {
    if (n < 1 || n > total) return;
    setStep(n);
  };

  const onPick = (key, val) => {
    setAnswer(key, val);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStep((s) => (s < total ? s + 1 : s));
    }, 500);
  };

  const handleSubmit = () => {
    if (submitted.current || saving) return;
    submitted.current = true;
    const timeTaken = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    onSubmitRef.current(answersRef.current, timeTaken);
  };

  const q = questions[step - 1];
  const pct = (step / total) * 100;
  const isLast = step === total;
  const timerClass = left <= 60 ? 'timer-danger' : left <= 180 ? 'timer-warning' : '';

  return (
    <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white justify-content-between">
            <h5 className="modal-title text-white mb-0">{title}</h5>
            <div className="d-flex align-items-center">
              <span className={`badge bg-light text-primary me-3 timer-display ${timerClass}`}>
                <span>{formatTime(left)}</span>
              </span>
            </div>
          </div>

          <div className="modal-body p-4">
            <div className="form-grid-3" style={{ marginBottom: '1rem' }}>
              <div className="field">
                <label className="field-label">Employer&apos;s Name</label>
                <input className="field-input" value={metaFields.company || ''} readOnly />
              </div>
              <div className="field">
                <label className="field-label">Driver&apos;s Name</label>
                <input className="field-input" value={metaFields.driver || ''} readOnly />
              </div>
              <div className="field">
                <label className="field-label">Date</label>
                <input type="date" className="field-input" value={metaFields.date || ''} readOnly />
              </div>
            </div>
            <hr className="my-3" />

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">
                  Question <span>{step}</span> of {total}
                </span>
              </div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {q ? (
              <div className="question-step active" data-step={step}>
                <div className="question-block p-3 border rounded">
                  <label className="radiolabel fw-bold mb-3 d-block">
                    {step}. {q.text.replace(/^\d+\.\s*/, '')}
                  </label>
                  {q.image ? <img src={q.image} alt="" className="quizimg" /> : null}
                  {q.options.map((opt, oi) => {
                    const value = valueMode === 'index' ? opt.value : typeof opt === 'string' ? opt : opt.label;
                    const label = typeof opt === 'string' ? opt : opt.label;
                    const id = `${q.key}_${oi}`;
                    return (
                      <div className="form-check" key={id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={q.key}
                          id={id}
                          value={value}
                          checked={answers[q.key] === value}
                          onChange={() => onPick(q.key, value)}
                        />
                        <label className="form-check-label" htmlFor={id}>
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="modal-footer bg-light">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <small className="text-muted">
                Questions: {total} | Time Limit: <span>{durationMin} minutes</span>
              </small>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  disabled={step === 1 || saving}
                  onClick={() => goStep(step - 1)}
                >
                  Previous
                </button>
                {!isLast ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={() => goStep(step + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button type="button" className="btn btn-success" disabled={saving} onClick={handleSubmit}>
                    {saving ? 'Submitting…' : 'Submit Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnglishQuizModal({ fields, answers, setAnswers, onClose, onSubmit, saving, durationMin = 10 }) {
  const totalSec = durationMin * 60;
  const [left, setLeft] = useState(totalSec);
  const startedAt = useRef(Date.now());
  const submitted = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left !== 0 || submitted.current) return;
    submitted.current = true;
    window.alert('Time is up! The quiz will be submitted automatically.');
    doSubmit();
  }, [left]);

  const doSubmit = () => {
    if (saving) return;
    submitted.current = true;
    const timeTaken = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    onSubmitRef.current(
      {
        ...answersRef.current,
        quest_emp_name: fields.appcompany_name,
        quest_driver_name: fields.driver_name,
        quest_date: fields.application_date,
      },
      timeTaken
    );
  };

  const timerClass = left <= 60 ? 'timer-danger' : left <= 180 ? 'timer-warning' : '';

  return (
    <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white justify-content-between">
            <h5 className="modal-title text-white mb-0">English Questionnaire Test</h5>
            <div className="d-flex align-items-center">
              <span className={`badge bg-light text-primary me-3 timer-display ${timerClass}`}>
                <span>{formatTime(left)}</span>
              </span>
            </div>
          </div>
          <div className="modal-body p-4">
            <div className="form-grid-3" style={{ marginBottom: '1rem' }}>
              <div className="field">
                <label className="field-label">Employer&apos;s Name</label>
                <input className="field-input" value={fields.appcompany_name || ''} readOnly />
              </div>
              <div className="field">
                <label className="field-label">Driver&apos;s Name</label>
                <input className="field-input" value={fields.driver_name || ''} readOnly />
              </div>
              <div className="field">
                <label className="field-label">Date</label>
                <input type="date" className="field-input" value={fields.application_date || ''} readOnly />
              </div>
            </div>
            <div className="form-grid">
              {ENGLISH_QUESTIONS.map(([fn, fl]) => (
                <div className="field" key={fn}>
                  <label className="field-label">{fl}</label>
                  <input
                    className="field-input"
                    value={answers[fn] || ''}
                    onChange={(e) => setAnswers((p) => ({ ...p, [fn]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer bg-light">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <small className="text-muted">
                Time Limit: <span>{durationMin} minutes</span>
              </small>
              <button type="button" className="btn btn-primary" disabled={saving} onClick={doSubmit}>
                {saving ? 'Submitting…' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizSection({ mode, state, setState, readOnly }) {
  const [open, setOpen] = useState(null);
  const [viewResults, setViewResults] = useState(null);
  const [english, setEnglish] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isAdminReview = mode === 'edit' || mode === 'view';

  const cards = useMemo(
    () => [
      { key: 'english', ...QUIZ_META.english },
      { key: 'hos', ...QUIZ_META.hos },
      { key: 'preTrip', ...QUIZ_META.preTrip },
      { key: 'traffic', ...QUIZ_META.traffic },
    ],
    []
  );

  const metaFields = {
    company: state.fields.appcompany_name || state.fields.company_display || '',
    driver: state.fields.driver_name || '',
    date: state.fields.application_date || '',
  };

  const correctFromApi = state.correctAnswers || {};

  const markComplete = (stateKey, payload, results) => {
    setState((prev) => ({
      ...prev,
      quizzes: {
        ...prev.quizzes,
        [stateKey]: {
          ...(prev.quizzes?.[stateKey] || {}),
          ...payload,
          completed_at: new Date().toISOString(),
          correct_answers: results.correct_answers,
          total_questions: results.total_questions,
          score_percentage: results.score_percentage,
        },
      },
    }));
  };

  const submitQuiz = async (quizKey, payload, timeTaken) => {
    const meta = QUIZ_META[quizKey];
    if (!meta || !state.applicationId) return;
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.post(`/application-forms/${state.applicationId}/quiz/${meta.endpoint}`, {
        ...payload,
        time_taken: timeTaken,
      });
      if (data.success) {
        markComplete(meta.stateKey, payload, data.results);
        setMessage(`${meta.title} submitted — Score ${data.results.score_percentage}%`);
        setOpen(null);
      } else {
        setMessage(data.message || 'Quiz submit failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Quiz submit failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="quiz-cards-grid quiz-cards-grid-4">
        {cards.map((c) => {
          const test = state.quizzes?.[c.stateKey];
          const done = test && test.completed_at;
          return (
            <div className="quiz-card" key={c.key} data-quiz-type={c.key}>
              <span className="duration-badge">{c.durationMin} Minutes</span>
              <div className="quiz-title">{c.title}</div>
              <div className="quiz-action-area">
                {done ? (
                  <>
                    <div className="alert-success-new">
                      <p>Completed!</p>
                      <span>
                        Score: {test.correct_answers}/{test.total_questions} (
                        {Number(test.score_percentage).toFixed(1)}%)
                      </span>
                      <span style={{ display: 'block', marginTop: 2 }}>
                        Completed on: {formatCompletedOn(test.completed_at)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-save btn-view-results"
                      onClick={() => setViewResults(c.key)}
                    >
                      <i className="ph-duotone ph-eye me-1" />
                      View Results
                    </button>
                  </>
                ) : isAdminReview ? (
                  <div className="alert-pending-quiz">
                    <p>Not Attempted</p>
                    <span>User has not attempted this quiz yet</span>
                  </div>
                ) : readOnly ? (
                  <span className="quiz-status-muted">Not completed</span>
                ) : (
                  <button type="button" className="btn-start-quiz" onClick={() => setOpen(c.key)}>
                    Start Quiz
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {message ? <div className="alert alert-info mt-3">{message}</div> : null}

      {viewResults === 'english' && state.quizzes.english && (
        <EnglishResultsModal
          title="English Questionnaire Test"
          test={state.quizzes.english}
          onClose={() => setViewResults(null)}
        />
      )}
      {viewResults === 'hos' && state.quizzes.hos && (
        <QuizResultsModal
          title="Hours of Service Questionnaire"
          test={state.quizzes.hos}
          questions={HOS_QUESTIONS}
          correctMap={correctFromApi.hoursOfService || HOS_CORRECT}
          valueMode="label"
          onClose={() => setViewResults(null)}
        />
      )}
      {viewResults === 'preTrip' && state.quizzes.preTrip && (
        <QuizResultsModal
          title="Pre-Trip Inspection Questionnaire"
          test={state.quizzes.preTrip}
          questions={PRETRIP_QUESTIONS}
          correctMap={correctFromApi.preTripInspection || PRETRIP_CORRECT}
          valueMode="label"
          onClose={() => setViewResults(null)}
        />
      )}
      {viewResults === 'traffic' && state.quizzes.traffic && (
        <QuizResultsModal
          title="Traffic & Road Sign Test"
          test={state.quizzes.traffic}
          questions={TRAFFIC_QUESTIONS}
          correctMap={correctFromApi.trafficSigns || TRAFFIC_CORRECT}
          valueMode="index"
          onClose={() => setViewResults(null)}
        />
      )}

      {open === 'english' && (
        <EnglishQuizModal
          fields={state.fields}
          answers={english}
          setAnswers={setEnglish}
          saving={saving}
          onClose={() => setOpen(null)}
          onSubmit={(payload, timeTaken) => submitQuiz('english', payload, timeTaken)}
        />
      )}
      {open === 'hos' && (
        <TimedQuizModal
          title="Hours of Service Questionnaire"
          durationMin={10}
          questions={HOS_QUESTIONS}
          valueMode="label"
          metaFields={metaFields}
          saving={saving}
          onClose={() => setOpen(null)}
          onSubmit={(answers, timeTaken) => submitQuiz('hos', answers, timeTaken)}
        />
      )}
      {open === 'preTrip' && (
        <TimedQuizModal
          title="Pre-Trip Inspection Questionnaire"
          durationMin={10}
          questions={PRETRIP_QUESTIONS}
          valueMode="label"
          metaFields={metaFields}
          saving={saving}
          onClose={() => setOpen(null)}
          onSubmit={(answers, timeTaken) => submitQuiz('preTrip', answers, timeTaken)}
        />
      )}
      {open === 'traffic' && (
        <TimedQuizModal
          title="Traffic & Road Sign Test"
          durationMin={30}
          questions={TRAFFIC_QUESTIONS}
          valueMode="index"
          metaFields={metaFields}
          saving={saving}
          onClose={() => setOpen(null)}
          onSubmit={(answers, timeTaken) => submitQuiz('traffic', answers, timeTaken)}
        />
      )}
    </>
  );
}
