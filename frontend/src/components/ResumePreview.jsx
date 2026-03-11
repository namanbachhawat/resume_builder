import React from 'react';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';

export default function ResumePreview({ resume }) {
    const templates = { 1: Template1, 2: Template2, 3: Template3 };
    const TemplateComponent = templates[resume.template] || Template1;

    return (
        <div id="resume-preview-container">
            <TemplateComponent resume={resume} />
        </div>
    );
}
