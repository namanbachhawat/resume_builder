import React from 'react';

export default function Template2({ resume }) {
    const { name, email, phone, location, linkedin, website, summary, education = [], experience = [], skills = [], projects = [] } = resume;

    const sidebarStyle = { backgroundColor: '#1e293b', color: '#e2e8f0', padding: '28px 20px', width: '200px', flexShrink: 0, minHeight: '842px' };
    const mainStyle = { padding: '28px 28px', flex: 1, backgroundColor: '#fff', color: '#1a1a1a' };

    const SideSection = ({ title }) => (
        <div style={{ marginTop: '20px', marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8b5cf6', borderBottom: '1px solid rgba(139,92,246,0.4)', paddingBottom: '4px' }}>
                {title}
            </div>
        </div>
    );

    const MainSection = ({ title }) => (
        <div style={{ marginTop: '20px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#4c1d95' }}>{title}</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd6fe' }} />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', fontFamily: "'Arial', sans-serif", fontSize: '10px', lineHeight: '1.5', minHeight: '842px' }}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                {/* Avatar placeholder */}
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#4c1d95', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', fontWeight: '700', color: '#c4b5fd' }}>
                    {(name || 'R').charAt(0).toUpperCase()}
                </div>

                <h1 style={{ fontSize: '14px', fontWeight: '700', textAlign: 'center', color: '#fff', lineHeight: '1.3', marginBottom: '4px' }}>
                    {name || 'Your Name'}
                </h1>

                <SideSection title="Contact" />
                <div style={{ fontSize: '9px', lineHeight: '1.8', color: '#94a3b8' }}>
                    {email && <div>✉ {email}</div>}
                    {phone && <div>📞 {phone}</div>}
                    {location && <div>📍 {location}</div>}
                    {linkedin && <div style={{ color: '#a78bfa' }}>🔗 {linkedin}</div>}
                    {website && <div style={{ color: '#a78bfa' }}>🌐 {website}</div>}
                </div>

                {skills.length > 0 && (
                    <>
                        <SideSection title="Skills" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {skills.map((skill, i) => (
                                <span key={i} style={{ backgroundColor: 'rgba(139,92,246,0.2)', color: '#c4b5fd', fontSize: '8.5px', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(139,92,246,0.3)' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {education.some(e => e.institution) && (
                    <>
                        <SideSection title="Education" />
                        {education.filter(e => e.institution).map((edu, i) => (
                            <div key={i} style={{ marginBottom: '8px', fontSize: '9px' }}>
                                <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '9.5px' }}>{edu.degree || ''} {edu.field}</div>
                                <div style={{ color: '#94a3b8' }}>{edu.institution}</div>
                                {(edu.startYear || edu.endYear) && <div style={{ color: '#64748b', fontSize: '8.5px' }}>{edu.startYear} – {edu.endYear}</div>}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Main Content */}
            <div style={mainStyle}>
                {/* Header */}
                <div style={{ borderBottom: '3px solid #8b5cf6', paddingBottom: '12px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e1b4b', marginBottom: '2px' }}>
                        {name || 'Your Name'}
                    </h2>
                    {experience[0]?.position && (
                        <p style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600' }}>{experience[0].position}</p>
                    )}
                </div>

                {summary && (
                    <>
                        <MainSection title="Professional Summary" />
                        <p style={{ fontSize: '9.5px', color: '#444', lineHeight: '1.6' }}>{summary}</p>
                    </>
                )}

                {experience.some(e => e.company || e.position) && (
                    <>
                        <MainSection title="Work Experience" />
                        {experience.filter(e => e.company || e.position).map((exp, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontWeight: '700', fontSize: '11px', color: '#1e1b4b' }}>{exp.position}</span>
                                        {exp.company && <span style={{ fontSize: '10px', color: '#6d28d9' }}> @ {exp.company}</span>}
                                    </div>
                                    <span style={{ fontSize: '8.5px', color: '#888', whiteSpace: 'nowrap' }}>
                                        {exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? '–' : ''}{exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p style={{ fontSize: '9px', color: '#555', lineHeight: '1.5', marginTop: '3px', borderLeft: '2px solid #ddd6fe', paddingLeft: '8px' }}>
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {projects.some(p => p.name) && (
                    <>
                        <MainSection title="Projects" />
                        {projects.filter(p => p.name).map((proj, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: '700', fontSize: '10px', color: '#1e1b4b' }}>{proj.name}</span>
                                    {proj.technologies && <span style={{ fontSize: '8.5px', color: '#7c3aed' }}>| {proj.technologies}</span>}
                                </div>
                                {proj.description && <p style={{ fontSize: '9px', color: '#555', marginTop: '2px' }}>{proj.description}</p>}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
