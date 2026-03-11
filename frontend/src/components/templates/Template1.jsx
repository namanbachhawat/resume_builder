import React from 'react';

function Section({ title }) {
    return (
        <div className="flex items-center gap-3 mt-5 mb-2">
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
                {title}
            </h2>
            <div style={{ flex: 1, height: '1.5px', backgroundColor: '#1e40af' }} />
        </div>
    );
}

export default function Template1({ resume }) {
    const { name, email, phone, location, linkedin, website, summary, education = [], experience = [], skills = [], projects = [] } = resume;

    const contactParts = [email, phone, location].filter(Boolean);

    return (
        <div style={{ fontFamily: "'Georgia', serif", fontSize: '10px', color: '#111', lineHeight: '1.5', padding: '36px 40px', minHeight: '842px', backgroundColor: '#fff' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111', marginBottom: '4px', fontFamily: '"Arial", sans-serif' }}>
                    {name || 'Your Name'}
                </h1>
                <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.5px' }}>
                    {contactParts.join(' • ')}
                </p>
                {(linkedin || website) && (
                    <p style={{ fontSize: '10px', color: '#1e40af', marginTop: '2px' }}>
                        {[linkedin, website].filter(Boolean).join(' • ')}
                    </p>
                )}
            </div>

            <div style={{ height: '2px', backgroundColor: '#1e40af', marginBottom: '4px' }} />

            {/* Summary */}
            {summary && (
                <>
                    <Section title="Professional Summary" />
                    <p style={{ fontSize: '10px', color: '#333', lineHeight: '1.6' }}>{summary}</p>
                </>
            )}

            {/* Experience */}
            {experience.some(e => e.company || e.position) && (
                <>
                    <Section title="Work Experience" />
                    {experience.filter(e => e.company || e.position).map((exp, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <span style={{ fontWeight: '700', fontSize: '11px' }}>{exp.position}</span>
                                    {exp.company && <span style={{ color: '#555', fontSize: '10px' }}> — {exp.company}</span>}
                                </div>
                                <span style={{ fontSize: '9px', color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            {exp.description && (
                                <p style={{ color: '#444', marginTop: '3px', fontSize: '9.5px', lineHeight: '1.5', paddingLeft: '8px', borderLeft: '2px solid #dbeafe' }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Education */}
            {education.some(e => e.institution) && (
                <>
                    <Section title="Education" />
                    {education.filter(e => e.institution).map((edu, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '11px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                                <span style={{ color: '#555', fontSize: '10px' }}> — {edu.institution}</span>
                                {edu.gpa && <span style={{ color: '#777', fontSize: '9px' }}> | GPA: {edu.gpa}</span>}
                            </div>
                            <span style={{ fontSize: '9px', color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {edu.startYear}{edu.startYear && edu.endYear ? ' – ' : ''}{edu.endYear}
                            </span>
                        </div>
                    ))}
                </>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <>
                    <Section title="Skills" />
                    <p style={{ fontSize: '10px', color: '#333' }}>{skills.join(' • ')}</p>
                </>
            )}

            {/* Projects */}
            {projects.some(p => p.name) && (
                <>
                    <Section title="Projects" />
                    {projects.filter(p => p.name).map((proj, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: '700', fontSize: '11px' }}>{proj.name}</span>
                                {proj.technologies && <span style={{ fontSize: '9px', color: '#1e40af' }}>({proj.technologies})</span>}
                            </div>
                            {proj.description && <p style={{ color: '#444', fontSize: '9.5px', lineHeight: '1.5', marginTop: '2px' }}>{proj.description}</p>}
                            {proj.link && <p style={{ fontSize: '9px', color: '#1e40af', marginTop: '2px' }}>{proj.link}</p>}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
