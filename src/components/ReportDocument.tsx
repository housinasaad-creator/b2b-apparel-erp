import React from 'react';
import { useI18n } from '../i18n';

export interface ReportModel {
  docTitle: string;
  reportNo: string;
  period: string;
  generatedOn: string;
  summary: { label: string; value: string; accent: string }[];
  columns: string[];
  rows: string[][];
  notes?: string;
}

interface Props {
  model: ReportModel;
}

export const ReportDocument = React.forwardRef<HTMLDivElement, Props>(({ model }, ref) => {
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const align = (lang === 'ar' ? 'right' : 'left') as 'right' | 'left';

  return (
    <div
      ref={ref}
      id="pdf-report-root"
      dir={dir}
      style={{
        width: 794,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        colorScheme: 'light',
        fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* Header band */}
      <div
        style={{
          backgroundColor: '#b45309',
          color: '#ffffff',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={`${process.env.PUBLIC_URL}/weave-badge.png`}
            alt=""
            width={52}
            height={52}
            style={{ width: 52, height: 52, display: 'block', borderRadius: 12 }}
          />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{t('company')}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{t('sidebarSub')}</div>
          </div>
        </div>
        <div style={{ textAlign: align }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{model.docTitle}</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            {t('repReportNo')}: {model.reportNo}
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 32px',
          backgroundColor: '#f1f5f9',
          borderBottom: '2px solid #e2e8f0',
          fontSize: 13,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ color: '#64748b' }}>{t('repGeneratedOn')}: </span>
          <span style={{ fontWeight: 700 }}>{model.generatedOn}</span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>{t('repPeriod')}: </span>
          <span style={{ fontWeight: 700 }}>{model.period}</span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>{t('repPreparedBy')}: </span>
          <span style={{ fontWeight: 700 }}>{t('company')}</span>
        </div>
      </div>

      <div style={{ padding: '24px 32px', backgroundColor: '#ffffff' }}>
        {/* Executive Summary */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#b45309',
            borderBottom: '2px solid #f59e0b',
            paddingBottom: 6,
            marginBottom: 16,
          }}
        >
          {t('repSummary')}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {model.summary.map((s, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderTop: `4px solid ${s.accent}`,
                borderRadius: 8,
                padding: '12px 14px',
                minHeight: 76,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Details table */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#b45309',
            borderBottom: '2px solid #f59e0b',
            paddingBottom: 6,
            marginBottom: 16,
          }}
        >
          {t('repDetails')}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              {model.columns.map((c, i) => (
                <th
                  key={i}
                  style={{
                    padding: '10px 12px',
                    textAlign: align,
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  backgroundColor: ri % 2 === 0 ? '#ffffff' : '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '9px 12px',
                      textAlign: align,
                      color: ci === 0 ? '#0f172a' : '#334155',
                      fontWeight: ci === 0 ? 700 : 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes */}
        {model.notes && (
          <div
            style={{
              marginTop: 24,
              backgroundColor: '#fffbeb',
              borderLeft: '4px solid #f59e0b',
              borderRadius: 6,
              padding: '12px 16px',
            }}
          >
            <div style={{ fontSize: 12, color: '#92400e', fontWeight: 700, marginBottom: 4 }}>
              {t('notesColon')}
            </div>
            <div style={{ fontSize: 13, color: '#334155' }}>{model.notes}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '2px solid #e2e8f0',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: 8,
          backgroundColor: '#ffffff',
        }}
      >
        <span>{t('repConfidential')}</span>
        <span>
          {t('company')} · {model.generatedOn}
        </span>
      </div>
    </div>
  );
});
