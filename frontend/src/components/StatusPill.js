import React from 'react';

export function StatusPill({ status }) {
  return <span className={`status-pill status-${status}`}>{status.replace('_', ' ')}</span>;
}

const PIPELINE_STEPS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

/**
 * Signature visual: a horizontal pipeline strip showing how far an
 * application has progressed. Rejected/withdrawn applications show a
 * halted, coral-colored bar instead of a normal progression.
 */
export function ApplicationPipeline({ status }) {
  if (status === 'REJECTED' || status === 'WITHDRAWN') {
    return (
      <div>
        <div className="pipeline">
          <div className="pipeline-step rejected" />
        </div>
        <div className="pipeline-label">{status === 'REJECTED' ? 'Not selected' : 'Withdrawn'}</div>
      </div>
    );
  }

  const currentIndex = PIPELINE_STEPS.indexOf(status);

  return (
    <div>
      <div className="pipeline">
        {PIPELINE_STEPS.map((step, idx) => (
          <div key={step} className={`pipeline-step ${idx <= currentIndex ? 'done' : ''}`} />
        ))}
      </div>
      <div className="pipeline-label">{PIPELINE_STEPS[currentIndex] || 'Applied'}</div>
    </div>
  );
}
