import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const ResourceDetailView = ({ resourceKey, resourceContent, colors, setActiveResource }) => {
  const resource = resourceContent[resourceKey];

  if (!resource) return null;

  return (
    <div className="resource-detail" style={{ padding: '20px', paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 1. Back Button */}
      <button
        onClick={() => setActiveResource(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: colors.teal,
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '16px 0',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </button>

      {/* 2. Header Section */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
        color: colors.white,
        padding: '32px 24px',
        borderRadius: '16px',
        marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>{resource.title}</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>{resource.subtitle}</p>
      </div>

      {/* 3. Intro Box */}
      {resource.intro && (
        <div style={{
          background: colors.lightTeal,
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          borderLeft: `4px solid ${colors.teal}`
        }}>
          <p style={{ color: colors.darkBlue, lineHeight: '1.6', margin: 0 }}>{resource.intro}</p>
        </div>
      )}

      {/* 4. Process Steps (OIAP Style) */}
      {resource.steps && resource.steps.map((step, idx) => (
        <div key={idx} style={{ background: colors.white, border: `2px solid ${colors.teal}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>{step.icon}</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, margin: 0 }}>{step.step}</h3>
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: colors.darkBlue, marginBottom: '16px' }}>{step.description}</p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {step.details.map((detail, dIdx) => (
              <li key={dIdx} style={{ color: colors.darkBlue, opacity: 0.8, marginBottom: '8px' }}>{detail}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* 5. Word Study Examples (Hebrew/Greek Style) */}
      {resource.examples && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.darkBlue, marginBottom: '16px' }}>Example Word Studies</h2>
          {resource.examples.map((ex, idx) => (
            <div key={idx} style={{ background: colors.white, border: `2px solid ${colors.teal}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.teal, fontFamily: 'serif', margin: 0 }}>{ex.word}</h3>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: colors.lightTeal, borderRadius: '8px', color: colors.darkBlue, fontWeight: 'bold' }}>{ex.language}</span>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: colors.darkBlue, marginBottom: '8px' }}>{ex.englishTranslation}</p>
              <p style={{ color: colors.darkBlue, opacity: 0.9, marginBottom: '16px', lineHeight: '1.5' }}>{ex.fullMeaning}</p>
              <div style={{ background: '#f0f9f9', padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${colors.teal}` }}>
                <p style={{ fontSize: '14px', color: colors.darkBlue, margin: 0 }}><strong>Insight:</strong> {ex.insight}</p>
              </div>
              <p style={{ fontSize: '12px', color: colors.darkBlue, opacity: 0.5, marginTop: '12px', margin: '12px 0 0 0' }}>Verses: {ex.verses}</p>
            </div>
          ))}
        </div>
      )}

      {/* 6. Tools Section */}
      {resource.tools && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.darkBlue, marginBottom: '16px' }}>Recommended Tools</h2>
          {resource.tools.map((tool, idx) => (
            <a key={idx} href={`https://${tool.url}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', background: colors.white, border: `1px solid ${colors.lightTeal}`, padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', color: colors.teal }}>{tool.name} →</div>
              <div style={{ fontSize: '13px', color: colors.darkBlue, opacity: 0.7 }}>{tool.description}</div>
            </a>
          ))}
        </div>
      )}

      {/* 7. Foundation Scripture */}
      {resource.scripture && (
        <div style={{ background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`, color: colors.white, padding: '24px', borderRadius: '16px', marginTop: '32px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '12px', fontStyle: 'italic', margin: '0 0 12px 0' }}>"{resource.scripture.text}"</p>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>— {resource.scripture.reference}</div>
        </div>
      )}
    </div>
  );
};