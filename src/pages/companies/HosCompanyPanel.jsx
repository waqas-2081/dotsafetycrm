import { useMemo, useState } from 'react';
import api from '../../services/api';

const HOS_HINTS = {
  samsara: {
    violations: 'Expected columns: Driver, Violation Type, Date, Tags',
    disconnection: 'Expected columns: Source, Details, Start Time, Duration, Status, Type',
    unidentified:
      'Expected columns: Vehicle, Unassigned Time, Unassigned Distance, Unassigned Segments, Pending Segments, Tags',
  },
  motive: {
    violations: 'Expected columns: Driver, Driver ID, Violation, Start, End, Duration (mins)',
    disconnection:
      'Expected columns: Vehicle, Disconnect Time, Disconnect Location, Disconnect Odometer, Reconnect Time, Reconnect Location, Reconnect Odometer, Distance, Status',
    unidentified:
      'Expected columns: Date, Status, Carrier, Home Base, Tractor, Trailer 1, Trailer 2, Trailer 3',
  },
  monarch: {
    violations: 'Expected columns: Driver, UserName, Date, Violation',
    disconnection:
      'Expected columns: Driver Before Jump, Status Before Jump, Location Before Jump, Date Time Before Jump, Driver After Jump, Status After Jump, Location After Jump, Distance (Miles), Time Elapsed',
    unidentified: 'Expected columns: Date, Status, Carrier, Home Base, Tractor, Trailer 1',
  },
  hos247: {
    violations: 'Expected columns: Date, Driver, Hours Drove, Violations, Form & Manner',
  },
};

const HOS_ROW_FIELDS = {
  violations: {
    samsara: [
      { key: 'driver_name', label: 'Driver', col: 'col-md-12' },
      { key: 'violation_type', label: 'Violation Type', col: 'col-md-12' },
      { key: 'date', label: 'Date', col: 'col-md-6', type: 'date' },
      { key: 'tags', label: 'Tags', col: 'col-md-6' },
    ],
    motive: [
      { key: 'driver_name', label: 'Driver', col: 'col-md-6' },
      { key: 'driver_eld_id', label: 'ELD ID', col: 'col-md-6' },
      { key: 'violation', label: 'Violation', col: 'col-md-12' },
      { key: 'start', label: 'Start', col: 'col-md-6', type: 'datetime-local' },
      { key: 'end', label: 'End', col: 'col-md-6', type: 'datetime-local' },
      { key: 'duration_mins', label: 'Duration (mins)', col: 'col-md-6' },
    ],
    monarch: [
      { key: 'driver_name', label: 'Driver', col: 'col-md-6' },
      { key: 'username', label: 'UserName', col: 'col-md-6' },
      { key: 'date', label: 'Date', col: 'col-md-6', type: 'datetime-local' },
      { key: 'violation', label: 'Violation', col: 'col-md-12' },
    ],
    hos247: [
      { key: 'date', label: 'Date', col: 'col-md-6' },
      { key: 'driver_name', label: 'Driver', col: 'col-md-6' },
      { key: 'hours_drove', label: 'Hours Drove', col: 'col-md-6' },
      { key: 'violations', label: 'Violations', col: 'col-md-6' },
      { key: 'form_and_manner', label: 'Form & Manner', col: 'col-md-12' },
    ],
  },
  disconnection: {
    samsara: [
      { key: 'source_vehicle', label: 'Source (Vehicle)', col: 'col-md-6' },
      { key: 'details', label: 'Details', col: 'col-md-12' },
      { key: 'start_time', label: 'Start Time', col: 'col-md-6' },
      { key: 'duration', label: 'Duration', col: 'col-md-6' },
      { key: 'status', label: 'Status', col: 'col-md-6' },
      { key: 'type', label: 'Type', col: 'col-md-6' },
    ],
    motive: [
      { key: 'vehicle', label: 'Vehicle', col: 'col-md-6' },
      { key: 'disconnect_time', label: 'Disconnect Time', col: 'col-md-6' },
      { key: 'disconnect_location', label: 'Disconnect Location', col: 'col-md-12' },
      { key: 'disconnect_odometer', label: 'Disconnect Odometer', col: 'col-md-6' },
      { key: 'reconnect_time', label: 'Reconnect Time', col: 'col-md-6' },
      { key: 'reconnect_location', label: 'Reconnect Location', col: 'col-md-12' },
      { key: 'reconnect_odometer', label: 'Reconnect Odometer', col: 'col-md-6' },
      { key: 'distance', label: 'Distance (mi)', col: 'col-md-6' },
      { key: 'status', label: 'Status', col: 'col-md-6' },
    ],
    monarch: [
      { key: 'driver_before_jump', label: 'Driver Before Jump', col: 'col-md-6' },
      { key: 'status_before_jump', label: 'Status Before', col: 'col-md-6' },
      { key: 'location_before_jump', label: 'Location Before', col: 'col-md-12' },
      { key: 'odometer_before_jump', label: 'Odometer Before', col: 'col-md-6' },
      { key: 'datetime_before_jump', label: 'DateTime Before', col: 'col-md-6' },
      { key: 'driver_after_jump', label: 'Driver After Jump', col: 'col-md-6' },
      { key: 'status_after_jump', label: 'Status After', col: 'col-md-6' },
      { key: 'location_after_jump', label: 'Location After', col: 'col-md-12' },
      { key: 'odometer_after_jump', label: 'Odometer After', col: 'col-md-6' },
      { key: 'datetime_after_jump', label: 'DateTime After', col: 'col-md-6' },
      { key: 'distance_miles', label: 'Distance (Miles)', col: 'col-md-6' },
      { key: 'time_elapsed', label: 'Time Elapsed', col: 'col-md-6' },
    ],
  },
  unidentified: {
    samsara: [
      { key: 'vehicle', label: 'Vehicle', col: 'col-md-6' },
      { key: 'unassigned_time', label: 'Unassigned Time', col: 'col-md-6' },
      { key: 'unassigned_distance', label: 'Unassigned Distance', col: 'col-md-6' },
      { key: 'unassigned_segments', label: 'Unassigned Segments', col: 'col-md-4' },
      { key: 'pending_segments', label: 'Pending Segments', col: 'col-md-4' },
      { key: 'annotated_segments', label: 'Annotated Segments', col: 'col-md-4' },
      { key: 'tags', label: 'Tags', col: 'col-md-6' },
    ],
    motive: [
      { key: 'driver_name', label: 'Driver', col: 'col-md-6' },
      { key: 'driver_eld_id', label: 'ELD ID', col: 'col-md-6' },
      { key: 'date', label: 'Date', col: 'col-md-6' },
      { key: 'status', label: 'Status', col: 'col-md-6' },
      { key: 'carrier', label: 'Carrier', col: 'col-md-6' },
      { key: 'home_base', label: 'Home Base', col: 'col-md-6' },
      { key: 'tractor', label: 'Tractor', col: 'col-md-6' },
      { key: 'trailer_1', label: 'Trailer 1', col: 'col-md-6' },
      { key: 'trailer_2', label: 'Trailer 2', col: 'col-md-6' },
      { key: 'trailer_3', label: 'Trailer 3', col: 'col-md-6' },
    ],
    monarch: [
      { key: 'driver_name', label: 'Driver', col: 'col-md-6' },
      { key: 'driver_eld_id', label: 'ELD ID', col: 'col-md-6' },
      { key: 'date', label: 'Date', col: 'col-md-6' },
      { key: 'status', label: 'Status', col: 'col-md-6' },
      { key: 'carrier', label: 'Carrier', col: 'col-md-6' },
      { key: 'home_base', label: 'Home Base', col: 'col-md-6' },
      { key: 'tractor', label: 'Tractor', col: 'col-md-6' },
      { key: 'trailer_1', label: 'Trailer 1', col: 'col-md-6' },
      { key: 'trailer_2', label: 'Trailer 2', col: 'col-md-6' },
      { key: 'trailer_3', label: 'Trailer 3', col: 'col-md-6' },
    ],
  },
};

const HOS_EDIT_TITLES = {
  violations: 'HOS Violation',
  disconnection: 'Disconnection Record',
  unidentified: 'Unidentified Log Record',
};

function fmtDate(d) {
  if (!d) return '—';
  const raw = String(d).substring(0, 10);
  const p = raw.split('-');
  if (p.length !== 3) return d;
  return `${p[1]}/${p[2]}/${p[0]}`;
}

function fmtDateTime(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function normalizeSource(source) {
  return String(source || '').trim().toLowerCase();
}

function getRowFields(type, source) {
  const typeFields = HOS_ROW_FIELDS[type] || {};
  return typeFields[normalizeSource(source)] || Object.values(typeFields)[0] || [];
}

function emptyRowFromFields(fields) {
  return fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});
}

function formatFieldInputValue(rawVal, fieldType) {
  if (rawVal == null || rawVal === '') return '';
  if (fieldType === 'date') return String(rawVal).substring(0, 10);
  if (fieldType === 'datetime-local') {
    return String(rawVal).substring(0, 16).replace(' ', 'T');
  }
  return String(rawVal);
}

function buildPayloadFromFields(fields, values) {
  const payload = {};
  fields.forEach((field) => {
    payload[field.key] = values[field.key] ?? '';
  });
  return payload;
}

function HosFieldGrid({ fields, values, onChange, idPrefix = 'hos-field' }) {
  return (
    <div className="row g-2">
      {fields.map((field) => (
        <div className={field.col} key={field.key}>
          <label className="ac-label" style={{ fontSize: '11.5px' }}>
            {field.label}
          </label>
          <input
            type={field.type || 'text'}
            className="form-control ac-input"
            placeholder={field.label}
            value={values[field.key] ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            id={`${idPrefix}-${field.key}`}
          />
        </div>
      ))}
    </div>
  );
}

function getImportRows(imp) {
  if (Array.isArray(imp?.rows)) return imp.rows;
  if (Array.isArray(imp?.monarch_rows)) return imp.monarch_rows;
  if (Array.isArray(imp?.motive_rows)) return imp.motive_rows;
  if (Array.isArray(imp?.samsara_rows)) return imp.samsara_rows;
  return [];
}

const EMPTY_FILTERS = { dateFrom: '', dateTo: '', driver: '', violation: '' };

function cellVal(value) {
  return value == null || value === '' ? '' : String(value);
}

function parseRowDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getHosHeaderLabels(type, source) {
  source = normalizeSource(source);
  if (type === 'violations') {
    if (source === 'samsara') return ['Driver', 'Violation Type', 'Date', 'Tags'];
    if (source === 'motive') {
      return ['Driver', 'ELD ID', 'Violation', 'Start', 'End', 'Duration (mins)'];
    }
    if (source === 'monarch') return ['Driver', 'UserName', 'Date', 'Violation'];
    return ['Date', 'Driver', 'Hours Drove', 'Violations', 'Form & Manner'];
  }
  if (type === 'disconnection') {
    if (source === 'samsara') {
      return ['Source/Vehicle', 'Details', 'Start Time', 'Duration', 'Status', 'Type'];
    }
    if (source === 'motive') {
      return [
        'Vehicle',
        'Disc. Time',
        'Disc. Location',
        'Disc. Odo.',
        'Rec. Time',
        'Rec. Location',
        'Rec. Odo.',
        'Distance',
        'Status',
      ];
    }
    return [
      'Driver Before',
      'Status Before',
      'Location Before',
      'Odo. Before',
      'DateTime Before',
      'Driver After',
      'Location After',
      'Distance (mi)',
      'Time Elapsed',
    ];
  }
  if (source === 'samsara') {
    return [
      'Vehicle',
      'Unassigned Time',
      'Unassigned Distance',
      'Unassigned Seg.',
      'Pending Seg.',
      'Annotated Seg.',
      'Tags',
    ];
  }
  return [
    'Driver',
    'ELD ID',
    'Date',
    'Status',
    'Carrier',
    'Home Base',
    'Tractor',
    'Trailer 1',
    'Trailer 2',
    'Trailer 3',
  ];
}

function getHosRowValues(type, source, row) {
  source = normalizeSource(source);
  if (type === 'violations') {
    if (source === 'samsara') {
      return [
        cellVal(row.driver_name),
        cellVal(row.violation_type),
        cellVal(fmtDate(row.date) !== '—' ? fmtDate(row.date) : row.date),
        cellVal(row.tags),
      ];
    }
    if (source === 'motive') {
      return [
        cellVal(row.driver_name),
        cellVal(row.driver_eld_id),
        cellVal(row.violation),
        cellVal(fmtDateTime(row.start) !== '—' ? fmtDateTime(row.start) : row.start),
        cellVal(fmtDateTime(row.end) !== '—' ? fmtDateTime(row.end) : row.end),
        cellVal(row.duration_mins),
      ];
    }
    if (source === 'monarch') {
      return [
        cellVal(row.driver_name),
        cellVal(row.username),
        cellVal(fmtDateTime(row.date) !== '—' ? fmtDateTime(row.date) : row.date),
        cellVal(row.violation),
      ];
    }
    return [
      cellVal(row.date),
      cellVal(row.driver_name),
      cellVal(row.hours_drove),
      cellVal(row.violations),
      cellVal(row.form_and_manner),
    ];
  }
  if (type === 'disconnection') {
    if (source === 'samsara') {
      return [
        cellVal(row.source_vehicle),
        cellVal(row.details),
        cellVal(row.start_time),
        cellVal(row.duration),
        cellVal(row.status),
        cellVal(row.type),
      ];
    }
    if (source === 'motive') {
      return [
        cellVal(row.vehicle),
        cellVal(row.disconnect_time),
        cellVal(row.disconnect_location),
        cellVal(row.disconnect_odometer),
        cellVal(row.reconnect_time),
        cellVal(row.reconnect_location),
        cellVal(row.reconnect_odometer),
        cellVal(row.distance),
        cellVal(row.status),
      ];
    }
    return [
      cellVal(row.driver_before_jump),
      cellVal(row.status_before_jump),
      cellVal(row.location_before_jump),
      cellVal(row.odometer_before_jump),
      cellVal(row.datetime_before_jump),
      cellVal(row.driver_after_jump),
      cellVal(row.location_after_jump),
      cellVal(row.distance_miles),
      cellVal(row.time_elapsed),
    ];
  }
  if (source === 'samsara') {
    return [
      cellVal(row.vehicle),
      cellVal(row.unassigned_time),
      cellVal(row.unassigned_distance),
      cellVal(row.unassigned_segments),
      cellVal(row.pending_segments),
      cellVal(row.annotated_segments),
      cellVal(row.tags),
    ];
  }
  return [
    cellVal(row.driver_name),
    cellVal(row.driver_eld_id),
    cellVal(row.date),
    cellVal(row.status),
    cellVal(row.carrier),
    cellVal(row.home_base),
    cellVal(row.tractor),
    cellVal(row.trailer_1),
    cellVal(row.trailer_2),
    cellVal(row.trailer_3),
  ];
}

function getRowDateValue(type, source, row) {
  source = normalizeSource(source);
  if (type === 'violations') {
    if (source === 'motive') return row.start || row.end;
    return row.date;
  }
  if (type === 'disconnection') {
    if (source === 'samsara') return row.start_time;
    if (source === 'motive') return row.disconnect_time;
    return row.datetime_before_jump;
  }
  if (source === 'samsara') return row.unassigned_time;
  return row.date;
}

function getRowDriverName(type, source, row) {
  source = normalizeSource(source);
  if (type === 'violations' || type === 'unidentified') return row.driver_name;
  if (type === 'disconnection' && source === 'monarch') {
    return row.driver_before_jump || row.driver_after_jump;
  }
  return row.driver_name || row.details || row.vehicle;
}

function getRowViolationText(type, source, row) {
  if (type !== 'violations') return '';
  source = normalizeSource(source);
  if (source === 'samsara') return row.violation_type;
  if (source === 'hos247') return row.violations;
  return row.violation;
}

function hasActiveFilters(filters) {
  return Boolean(
    filters.dateFrom || filters.dateTo || filters.driver.trim() || filters.violation.trim()
  );
}

function rowMatchesFilter(type, source, row, filters) {
  if (!hasActiveFilters(filters)) return true;

  const driverQuery = filters.driver.trim().toLowerCase();
  if (driverQuery) {
    const driverName = String(getRowDriverName(type, source, row) || '').toLowerCase();
    if (!driverName.includes(driverQuery)) return false;
  }

  const violationQuery = filters.violation.trim().toLowerCase();
  if (violationQuery && type === 'violations') {
    const violation = String(getRowViolationText(type, source, row) || '').toLowerCase();
    if (!violation.includes(violationQuery)) return false;
  }

  const rowDate = parseRowDate(getRowDateValue(type, source, row));
  if (filters.dateFrom || filters.dateTo) {
    if (!rowDate) return false;
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      from.setHours(0, 0, 0, 0);
      if (rowDate < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      if (rowDate > to) return false;
    }
  }

  return true;
}

function collectFilteredEntries(imports, type, source, filters) {
  const entries = [];
  for (const imp of imports || []) {
    const importSource = normalizeSource(imp.source || source);
    for (const row of getImportRows(imp)) {
      if (rowMatchesFilter(type, importSource, row, filters)) {
        entries.push({ imp, row, importSource });
      }
    }
  }
  return entries;
}

function HosTableHeaders({ type, source }) {
  if (type === 'violations') return <ViolHeaders source={source} />;
  if (type === 'disconnection') return <DiscHeaders source={source} />;
  return <UnidHeaders source={source} />;
}

function HosTableCells({ type, source, row }) {
  if (type === 'violations') return <ViolCells source={source} row={row} />;
  if (type === 'disconnection') return <DiscCells source={source} row={row} />;
  return <UnidCells source={source} row={row} />;
}

function ViolHeaders({ source }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <th>Driver</th>
        <th>Violation Type</th>
        <th>Date</th>
        <th>Tags</th>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <th>Driver</th>
        <th>ELD ID</th>
        <th>Violation</th>
        <th>Start</th>
        <th>End</th>
        <th>Duration (mins)</th>
      </>
    );
  }
  if (source === 'monarch') {
    return (
      <>
        <th>Driver</th>
        <th>UserName</th>
        <th>Date</th>
        <th>Violation</th>
      </>
    );
  }
  return (
    <>
      <th>Date</th>
      <th>Driver</th>
      <th>Hours Drove</th>
      <th>Violations</th>
      <th>Form & Manner</th>
    </>
  );
}

function ViolCells({ source, row }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.violation_type || '—'}</td>
        <td>{fmtDate(row.date)}</td>
        <td>{row.tags || '—'}</td>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.driver_eld_id || '—'}</td>
        <td>{row.violation || '—'}</td>
        <td>{fmtDateTime(row.start)}</td>
        <td>{fmtDateTime(row.end)}</td>
        <td>{row.duration_mins || '—'}</td>
      </>
    );
  }
  if (source === 'monarch') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.username || '—'}</td>
        <td>{fmtDateTime(row.date)}</td>
        <td>{row.violation || '—'}</td>
      </>
    );
  }
  return (
    <>
      <td>{row.date || '—'}</td>
      <td>{row.driver_name || '—'}</td>
      <td>{row.hours_drove || '—'}</td>
      <td>{row.violations || '—'}</td>
      <td>{row.form_and_manner || '—'}</td>
    </>
  );
}

function DiscHeaders({ source }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <th>Source/Vehicle</th>
        <th>Details</th>
        <th>Start Time</th>
        <th>Duration</th>
        <th>Status</th>
        <th>Type</th>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <th>Vehicle</th>
        <th>Disc. Time</th>
        <th>Disc. Location</th>
        <th>Disc. Odo.</th>
        <th>Rec. Time</th>
        <th>Rec. Location</th>
        <th>Rec. Odo.</th>
        <th>Distance</th>
        <th>Status</th>
      </>
    );
  }
  return (
    <>
      <th>Driver Before</th>
      <th>Status Before</th>
      <th>Location Before</th>
      <th>Odo. Before</th>
      <th>DateTime Before</th>
      <th>Driver After</th>
      <th>Location After</th>
      <th>Distance (mi)</th>
      <th>Time Elapsed</th>
    </>
  );
}

function DiscCells({ source, row }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <td>{row.source_vehicle || '—'}</td>
        <td>{row.details || '—'}</td>
        <td>{row.start_time || '—'}</td>
        <td>{row.duration || '—'}</td>
        <td>{row.status || '—'}</td>
        <td>{row.type || '—'}</td>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <td>{row.vehicle || '—'}</td>
        <td>{row.disconnect_time || '—'}</td>
        <td>{row.disconnect_location || '—'}</td>
        <td>{row.disconnect_odometer || '—'}</td>
        <td>{row.reconnect_time || '—'}</td>
        <td>{row.reconnect_location || '—'}</td>
        <td>{row.reconnect_odometer || '—'}</td>
        <td>{row.distance || '—'}</td>
        <td>{row.status || '—'}</td>
      </>
    );
  }
  return (
    <>
      <td>{row.driver_before_jump || '—'}</td>
      <td>{row.status_before_jump || '—'}</td>
      <td>{row.location_before_jump || '—'}</td>
      <td>{row.odometer_before_jump || '—'}</td>
      <td>{row.datetime_before_jump || '—'}</td>
      <td>{row.driver_after_jump || '—'}</td>
      <td>{row.location_after_jump || '—'}</td>
      <td>{row.distance_miles || '—'}</td>
      <td>{row.time_elapsed || '—'}</td>
    </>
  );
}

function UnidHeaders({ source }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <th>Vehicle</th>
        <th>Unassigned Time</th>
        <th>Unassigned Distance</th>
        <th>Unassigned Seg.</th>
        <th>Pending Seg.</th>
        <th>Annotated Seg.</th>
        <th>Tags</th>
      </>
    );
  }
  return (
    <>
      <th>Driver</th>
      <th>ELD ID</th>
      <th>Date</th>
      <th>Status</th>
      <th>Carrier</th>
      <th>Home Base</th>
      <th>Tractor</th>
      <th>Trailer 1</th>
      <th>Trailer 2</th>
      <th>Trailer 3</th>
    </>
  );
}

function UnidCells({ source, row }) {
  source = normalizeSource(source);
  if (source === 'samsara') {
    return (
      <>
        <td>{row.vehicle || '—'}</td>
        <td>{row.unassigned_time || '—'}</td>
        <td>{row.unassigned_distance || '—'}</td>
        <td>{row.unassigned_segments ?? '—'}</td>
        <td>{row.pending_segments ?? '—'}</td>
        <td>{row.annotated_segments ?? '—'}</td>
        <td>{row.tags || '—'}</td>
      </>
    );
  }
  return (
    <>
      <td>{row.driver_name || '—'}</td>
      <td>{row.driver_eld_id || '—'}</td>
      <td>{row.date || '—'}</td>
      <td>{row.status || '—'}</td>
      <td>{row.carrier || '—'}</td>
      <td>{row.home_base || '—'}</td>
      <td>{row.tractor || '—'}</td>
      <td>{row.trailer_1 || '—'}</td>
      <td>{row.trailer_2 || '—'}</td>
      <td>{row.trailer_3 || '—'}</td>
    </>
  );
}

function ImportList({
  companyId,
  companyEmail,
  source,
  sourceLabel,
  type,
  imports,
  onRefresh,
}) {
  const [alert, setAlert] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(EMPTY_FILTERS);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const [emailing, setEmailing] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualImportName, setManualImportName] = useState('');
  const [manualRows, setManualRows] = useState([]);
  const [manualSaving, setManualSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContext, setEditContext] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const rowFields = useMemo(() => getRowFields(type, source), [type, source]);

  const typePath =
    type === 'violations'
      ? 'violations'
      : type === 'disconnection'
        ? 'disconnection'
        : 'unidentified';

  const title =
    type === 'violations'
      ? 'HOS Violations'
      : type === 'disconnection'
        ? 'Disconnection Report'
        : 'Unidentified Log Report';

  const handleImport = async () => {
    if (!importFile) {
      setAlert({ type: 'danger', message: 'Please select a file.' });
      return;
    }
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', importFile);
      fd.append('source', source);
      await api.post(`/companies/${companyId}/hos/${typePath}/import`, fd);
      setImportOpen(false);
      setImportFile(null);
      setAlert({ type: 'success', message: `${title} imported successfully.` });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Import failed. Please try again.' });
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteImport = async (importId) => {
    if (!window.confirm('Delete this entire import and all its rows?')) return;
    try {
      await api.delete(`/companies/${companyId}/hos/${typePath}/imports/${importId}`);
      setAlert({ type: 'success', message: 'Import deleted.' });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to delete import.' });
    }
  };

  const handleDeleteRow = async (importId, rowId) => {
    if (!window.confirm('Delete this row?')) return;
    try {
      await api.delete(
        `/companies/${companyId}/hos/${typePath}/imports/${importId}/rows/${rowId}`
      );
      onRefresh?.();
    } catch {
      window.alert('Failed to delete row.');
    }
  };

  const openManualEntry = () => {
    setManualImportName('');
    setManualRows([emptyRowFromFields(rowFields)]);
    setManualOpen(true);
  };

  const addManualRow = () => {
    setManualRows((prev) => [...prev, emptyRowFromFields(rowFields)]);
  };

  const removeManualRow = (index) => {
    setManualRows((prev) => {
      if (prev.length <= 1) {
        setAlert({ type: 'danger', message: 'At least one row is required.' });
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateManualRow = (index, key, value) => {
    setManualRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const handleSaveManualEntry = async () => {
    const importName = manualImportName.trim();
    if (!importName) {
      setAlert({ type: 'danger', message: 'Please enter an import name.' });
      return;
    }
    setManualSaving(true);
    try {
      const { data } = await api.post(`/companies/${companyId}/hos/${typePath}/manual`, {
        source: normalizeSource(source),
        import_name: importName,
        rows: manualRows,
      });
      if (!data.success) {
        setAlert({ type: 'danger', message: 'Failed to save. Please try again.' });
        return;
      }
      setManualOpen(false);
      setManualImportName('');
      setManualRows([]);
      setAlert({
        type: 'success',
        message: `Manual entry saved! ${(data.import?.rows || []).length} row(s) added.`,
      });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Request failed. Please try again.' });
    } finally {
      setManualSaving(false);
    }
  };

  const openEditRow = (importId, row, importSource) => {
    const fields = getRowFields(type, importSource);
    const values = {};
    fields.forEach((field) => {
      values[field.key] = formatFieldInputValue(row[field.key], field.type);
    });
    setEditContext({ importId, rowId: row.id, importSource });
    setEditValues(values);
    setEditOpen(true);
  };

  const handleSaveEditRow = async () => {
    if (!editContext) return;
    setEditSaving(true);
    try {
      const fields = getRowFields(type, editContext.importSource);
      const payload = buildPayloadFromFields(fields, editValues);
      const { data } = await api.put(
        `/companies/${companyId}/hos/${typePath}/imports/${editContext.importId}/rows/${editContext.rowId}`,
        payload
      );
      if (!data.success) {
        setAlert({ type: 'danger', message: 'Failed to save. Please try again.' });
        return;
      }
      setEditOpen(false);
      setEditContext(null);
      setEditValues({});
      setAlert({ type: 'success', message: 'Row updated successfully.' });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Request failed. Please try again.' });
    } finally {
      setEditSaving(false);
    }
  };

  const downloadImport = async (importId) => {
    try {
      const response = await api.get(
        `/companies/${companyId}/hos/${typePath}/imports/${importId}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `hos-${typePath}-${importId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert('Download failed.');
    }
  };

  const filteredEntries = useMemo(
    () => collectFilteredEntries(imports, type, source, activeFilters),
    [imports, type, source, activeFilters]
  );

  const applyFilters = () => {
    setActiveFilters({ ...filterDraft });
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterDraft(EMPTY_FILTERS);
    setActiveFilters(EMPTY_FILTERS);
  };

  const handleEmailFiltered = async () => {
    if (!hasActiveFilters(activeFilters)) {
      setAlert({ type: 'warning', message: 'Apply at least one filter before emailing results.' });
      return;
    }
    if (filteredEntries.length === 0) {
      setAlert({ type: 'warning', message: 'No rows match the current filters.' });
      return;
    }
    if (!companyEmail) {
      setAlert({
        type: 'danger',
        message: 'This company does not have an email address on file.',
      });
      return;
    }

    const sampleSource = filteredEntries[0].importSource;
    const headers = ['Import Name', ...getHosHeaderLabels(type, sampleSource)];
    const rows = filteredEntries.map(({ imp, row, importSource }) => [
      imp.import_name,
      ...getHosRowValues(type, importSource, row),
    ]);

    setEmailing(true);
    try {
      const { data } = await api.post(`/companies/${companyId}/hos-send-filtered`, {
        type: typePath,
        source: normalizeSource(source),
        report_label: `${sourceLabel} — ${title}`,
        headers,
        rows,
      });
      setAlert({ type: 'success', message: data.message || 'Filtered report emailed successfully.' });
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to email filtered report.',
      });
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h6 className="mb-0 fw-bold" style={{ color: '#36445e' }}>
          {sourceLabel} — {title} Imports
        </h6>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={`btn btn-outline-secondary${hasActiveFilters(activeFilters) ? ' active' : ''}`}
            style={{ marginTop: 0 }}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <i className="ph-duotone ph-funnel me-1"></i> Filter
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{ marginTop: 0 }}
            onClick={openManualEntry}
          >
            <i className="ph-duotone ph-pencil-line me-1"></i> Manual Entry
          </button>
          <button
            type="button"
            className="btn btn-primary ac-btn-save btn-import-hos"
            style={{ marginTop: 0 }}
            onClick={() => setImportOpen(true)}
          >
            <i className="ph-duotone ph-upload-simple me-1"></i> Import Excel / CSV
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="hos-filter-panel mb-3">
          <div className="row g-2">
            <div className="col-md-3">
              <label className="ac-label">Date From</label>
              <input
                type="date"
                className="form-control ac-input"
                value={filterDraft.dateFrom}
                onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="ac-label">Date To</label>
              <input
                type="date"
                className="form-control ac-input"
                value={filterDraft.dateTo}
                onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="ac-label">Driver</label>
              <input
                type="text"
                className="form-control ac-input"
                placeholder="Search driver name"
                value={filterDraft.driver}
                onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, driver: e.target.value }))
                }
              />
            </div>
            {type === 'violations' && (
              <div className="col-md-3">
                <label className="ac-label">Violation</label>
                <input
                  type="text"
                  className="form-control ac-input"
                  placeholder="Search violation"
                  value={filterDraft.violation}
                  onChange={(e) =>
                    setFilterDraft((prev) => ({ ...prev, violation: e.target.value }))
                  }
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="button" className="btn btn-primary btn-sm" onClick={applyFilters}>
              Apply Filter
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              disabled={emailing || !hasActiveFilters(activeFilters)}
              onClick={handleEmailFiltered}
            >
              <i className="ph-duotone ph-envelope-simple me-1"></i>
              {emailing ? 'Sending…' : 'Email Filtered Report'}
            </button>
          </div>
        </div>
      )}

      {hasActiveFilters(activeFilters) && (
        <div className="alert alert-light border py-2 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small">
            Filtered by:{' '}
            <strong>
              {[
                activeFilters.dateFrom && `from ${activeFilters.dateFrom}`,
                activeFilters.dateTo && `to ${activeFilters.dateTo}`,
                activeFilters.driver.trim() && `driver "${activeFilters.driver.trim()}"`,
                activeFilters.violation.trim() &&
                  `violation "${activeFilters.violation.trim()}"`,
              ]
                .filter(Boolean)
                .join(', ')}
            </strong>
            {' · '}
            {filteredEntries.length} row(s)
          </span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.message}
        </div>
      )}

      <div>
        {(!imports || imports.length === 0) && (
          <div className="text-muted small py-3 text-center">
            No {title} imported yet for {sourceLabel}.
          </div>
        )}
        {hasActiveFilters(activeFilters) &&
          filteredEntries.length === 0 &&
          (imports || []).length > 0 && (
            <div className="text-muted small py-3 text-center">
              No rows match the current filters.
            </div>
          )}
        {(imports || []).map((imp) => {
          const importSource = normalizeSource(imp.source || source);
          const rows = getImportRows(imp).filter((row) =>
            rowMatchesFilter(type, importSource, row, activeFilters)
          );
          if (hasActiveFilters(activeFilters) && rows.length === 0) return null;
          return (
            <div
              className="hos-import-card"
              key={imp.id}
              data-import-id={imp.id}
              data-source={importSource}
            >
              <div className="hos-import-header">
                <div>
                  <strong>{imp.import_name}</strong>
                  <span className="hos-import-meta">
                    {rows.length} row(s) · imported{' '}
                    {imp.imported_at ? fmtDateTime(imp.imported_at) : '—'}
                  </span>
                </div>
                <div className="hos-import-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    title="Download CSV"
                    onClick={() => downloadImport(imp.id)}
                  >
                    <i className="ph-duotone ph-download-simple"></i> Download
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteImport(imp.id)}
                  >
                    <i className="ph-duotone ph-trash"></i> Delete Import
                  </button>
                </div>
              </div>
              <div className="table-responsive mt-2">
                <table className="table hos-data-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th></th>
                      <HosTableHeaders type={type} source={importSource} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-muted text-center py-2">
                          No rows in this import.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr key={row.id} data-row-id={row.id}>
                          <td className="text-nowrap">
                            <button
                              type="button"
                              className="btn btn-xs btn-outline-primary me-1"
                              title="Edit"
                              onClick={() => openEditRow(imp.id, row, importSource)}
                            >
                              <i className="ph-duotone ph-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-outline-danger"
                              onClick={() => handleDeleteRow(imp.id, row.id)}
                            >
                              <i className="ph-duotone ph-trash"></i>
                            </button>
                          </td>
                          <HosTableCells type={type} source={importSource} row={row} />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {importOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Import {title} — {sourceLabel}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setImportOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="ac-label">Select Excel or CSV File</label>
                  <input
                    type="file"
                    className="form-control ac-file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <div className="ac-form-note mt-1">
                    {HOS_HINTS[source]?.[type] || ''}
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setImportOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={importing}
                  onClick={handleImport}
                >
                  <i className="ph-duotone ph-upload-simple me-1"></i>{' '}
                  {importing ? 'Importing…' : 'Upload & Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {manualOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Add Manual Entry — {sourceLabel} {title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setManualOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="ac-label">
                    Import Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control ac-input"
                    placeholder="e.g. Manual Entry — May 2025"
                    value={manualImportName}
                    onChange={(e) => setManualImportName(e.target.value)}
                  />
                  <div className="ac-form-note">
                    This groups all rows you add below into one import record.
                  </div>
                </div>
                {manualRows.map((row, index) => (
                  <div className="manual-row-card" key={`manual-row-${index}`}>
                    <button
                      type="button"
                      className="manual-row-remove"
                      title="Remove row"
                      onClick={() => removeManualRow(index)}
                    >
                      <i className="ph-duotone ph-x-circle"></i>
                    </button>
                    <HosFieldGrid
                      fields={rowFields}
                      values={row}
                      idPrefix={`manual-${index}`}
                      onChange={(key, value) => updateManualRow(index, key, value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={addManualRow}
                >
                  <i className="ph-duotone ph-plus me-1"></i> Add Another Row
                </button>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setManualOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={manualSaving}
                  onClick={handleSaveManualEntry}
                >
                  <i className="ph-duotone ph-floppy-disk me-1"></i>{' '}
                  {manualSaving ? 'Saving…' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editOpen && editContext && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Edit {HOS_EDIT_TITLES[type]}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <HosFieldGrid
                  fields={getRowFields(type, editContext.importSource)}
                  values={editValues}
                  idPrefix="edit-row"
                  onChange={(key, value) =>
                    setEditValues((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={editSaving}
                  onClick={handleSaveEditRow}
                >
                  <i className="ph-duotone ph-floppy-disk me-1"></i>{' '}
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HosCompanyPanel({
  companyId,
  companyEmail,
  source,
  sourceLabel,
  hosImports,
  discImports,
  unidImports,
  showDisc,
  showUnid,
  onRefresh,
}) {
  const [subTab, setSubTab] = useState('violations');

  const filteredHos = useMemo(
    () => (hosImports || []).filter((i) => normalizeSource(i.source) === normalizeSource(source)),
    [hosImports, source]
  );
  const filteredDisc = useMemo(
    () => (discImports || []).filter((i) => normalizeSource(i.source) === normalizeSource(source)),
    [discImports, source]
  );
  const filteredUnid = useMemo(
    () => (unidImports || []).filter((i) => normalizeSource(i.source) === normalizeSource(source)),
    [unidImports, source]
  );

  return (
    <>
      <ul
        className="nav nav-tabs hos-sub-tabs mb-0 mt-3"
        id={`hosSubTabs-${source}`}
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link${subTab === 'violations' ? ' active' : ''}`}
            type="button"
            role="tab"
            onClick={() => setSubTab('violations')}
          >
            HOS Violations
          </button>
        </li>
        {showDisc && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link${subTab === 'disconnection' ? ' active' : ''}`}
              type="button"
              role="tab"
              onClick={() => setSubTab('disconnection')}
            >
              Disconnection Report
            </button>
          </li>
        )}
        {showUnid && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link${subTab === 'unidentified' ? ' active' : ''}`}
              type="button"
              role="tab"
              onClick={() => setSubTab('unidentified')}
            >
              Unidentified Log Report
            </button>
          </li>
        )}
      </ul>

      <div
        className="tab-content hos-sub-content"
        style={{
          border: '1px solid #dde8f8',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '14px 14px 10px',
        }}
      >
        {subTab === 'violations' && (
          <ImportList
            companyId={companyId}
            companyEmail={companyEmail}
            source={source}
            sourceLabel={sourceLabel}
            type="violations"
            imports={filteredHos}
            onRefresh={onRefresh}
          />
        )}
        {showDisc && subTab === 'disconnection' && (
          <ImportList
            companyId={companyId}
            companyEmail={companyEmail}
            source={source}
            sourceLabel={sourceLabel}
            type="disconnection"
            imports={filteredDisc}
            onRefresh={onRefresh}
          />
        )}
        {showUnid && subTab === 'unidentified' && (
          <ImportList
            companyId={companyId}
            companyEmail={companyEmail}
            source={source}
            sourceLabel={sourceLabel}
            type="unidentified"
            imports={filteredUnid}
            onRefresh={onRefresh}
          />
        )}
      </div>
    </>
  );
}

export { fmtDate };
