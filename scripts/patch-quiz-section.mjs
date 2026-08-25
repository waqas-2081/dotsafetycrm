import fs from 'fs';

const p = 'd:/react project/dotsafetyadmin/frontend/src/pages/forms/components/QuizSection.jsx';
const s = fs.readFileSync(p, 'utf8');
const i = s.indexOf('export default function QuizSection');
const head = s.slice(0, i);

const tail = `export default function QuizSection({ mode, state, setState, readOnly }) {
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
      const { data } = await api.post(\`/application-forms/\${state.applicationId}/quiz/\${meta.endpoint}\`, {
        ...payload,
        time_taken: timeTaken,
      });
      if (data.success) {
        markComplete(meta.stateKey, payload, data.results);
        setMessage(\`\${meta.title} submitted — Score \${data.results.score_percentage}%\`);
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
`;

fs.writeFileSync(p, head + tail);
console.log('wrote', p, 'bytes', fs.statSync(p).size);
