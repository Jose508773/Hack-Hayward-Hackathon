document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');
  const submitMediaBtn = document.getElementById('submit-media-btn');
  const leftColumn = document.getElementById('left-column');
  const rightColumn = document.getElementById('right-column');
  const textInputSection = document.getElementById('text-input-section');
  const mediaUploadSection = document.getElementById('media-upload-section');

  const ideaInput = document.getElementById('idea-input');
  const problemInput = document.getElementById('problem-input');
  const solutionInput = document.getElementById('solution-input');
  const audienceInput = document.getElementById('audience-input');

  // Upload Logic
  const fileUpload = document.getElementById('media-upload');
  const uploadZone = document.getElementById('media-upload-section');
  const filePreview = document.getElementById('file-preview');
  const fileNameText = document.getElementById('file-name');
  const removeFileBtn = document.getElementById('remove-file-btn');
  const uploadTitle = document.querySelector('.upload-title');
  const uploadSubtitle = document.querySelector('.upload-subtitle');
  let selectedFile = null;

  fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      selectedFile = e.target.files[0];
      fileNameText.textContent = selectedFile.name;
      filePreview.classList.remove('hidden');
      uploadTitle.classList.add('hidden');
      uploadSubtitle.classList.add('hidden');
    }
  });

  removeFileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileUpload.value = '';
    selectedFile = null;
    filePreview.classList.add('hidden');
    uploadTitle.classList.remove('hidden');
    uploadSubtitle.classList.remove('hidden');
  });

  ['dragover', 'dragenter'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
    });
  });

  uploadZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length > 0) {
      fileUpload.files = e.dataTransfer.files;
      fileUpload.dispatchEvent(new Event('change'));
    }
  });
  
  const resultsSection = document.getElementById('results-section');
  const questionsContainer = document.getElementById('questions-container');
  const analysisContainer = document.getElementById('analysis-container');
  
  // Modal Logic
  const navWhyUs = document.getElementById('nav-why-us');
  const whyUsModal = document.getElementById('why-us-modal');
  const closeWhyUs = document.getElementById('close-why-us');
  
  const navFeatures = document.getElementById('nav-features');
  const featuresModal = document.getElementById('features-modal');
  const closeFeatures = document.getElementById('close-features');

  if(navWhyUs && whyUsModal && closeWhyUs) {
    navWhyUs.addEventListener('click', (e) => {
      e.preventDefault();
      whyUsModal.classList.remove('hidden');
    });
    closeWhyUs.addEventListener('click', () => {
      whyUsModal.classList.add('hidden');
    });
    whyUsModal.addEventListener('click', (e) => {
      if(e.target === whyUsModal) whyUsModal.classList.add('hidden');
    });
  }
  
  if(navFeatures && featuresModal && closeFeatures) {
    navFeatures.addEventListener('click', (e) => {
      e.preventDefault();
      featuresModal.classList.remove('hidden');
    });
    closeFeatures.addEventListener('click', () => {
      featuresModal.classList.add('hidden');
    });
    featuresModal.addEventListener('click', (e) => {
      if(e.target === featuresModal) featuresModal.classList.add('hidden');
    });
  }
  
  const defaultState = document.getElementById('default-state');
  const processingState = document.getElementById('processing-state');
  const simulatedText = document.getElementById('simulated-text');
  
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];
  
  const questionsList = document.getElementById('questions-list');
  const coreProblemEl = document.getElementById('core-problem');
  const targetAudienceEl = document.getElementById('target-audience');
  const proposedSolutionEl = document.getElementById('proposed-solution');
  const leanPlanEl = document.getElementById('lean-plan');
  const vcQuestionsEl = document.getElementById('vc-questions');

  function resetResults() {
    resultsSection.classList.add('hidden');
    defaultState.classList.add('hidden');
    processingState.classList.remove('hidden');
    questionsContainer.classList.add('hidden');
    analysisContainer.classList.add('hidden');
    
    steps.forEach(s => s.className = 'pending');
    simulatedText.textContent = '';
    
    questionsList.innerHTML = '';
    coreProblemEl.innerHTML = '';
    targetAudienceEl.innerHTML = '';
    proposedSolutionEl.innerHTML = '';
    leanPlanEl.innerHTML = '';
    vcQuestionsEl.innerHTML = '';
  }
  
  const resetPitchBtn = document.getElementById('reset-pitch-btn');
  if (resetPitchBtn) {
    resetPitchBtn.addEventListener('click', () => {
      // Restore Input Visibilities
      textInputSection.classList.remove('hidden');
      if (submitBtn) submitBtn.classList.remove('hidden');
      
      mediaUploadSection.classList.remove('hidden');
      if (submitMediaBtn) submitMediaBtn.classList.remove('hidden');
      
      // Move media upload back exactly where it belongs
      rightColumn.prepend(mediaUploadSection);
      
      // Purge all results
      resetResults();
      
      // Send user nicely to the top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Hide the back button again
      resetPitchBtn.classList.add('hidden');
    });
  }

  submitBtn.addEventListener('click', () => performAnalysis('text'));
  if(submitMediaBtn) submitMediaBtn.addEventListener('click', () => performAnalysis('media'));

  async function performAnalysis(inputType) {
    const summary = ideaInput.value.trim();
    const problem = problemInput.value.trim();
    const solution = solutionInput.value.trim();
    const audience = audienceInput.value.trim();
    
    const hasText = summary || problem || solution || audience;

    if (inputType === 'text' && !hasText) {
      alert("Please enter your pitch details first.");
      return;
    }
    if (inputType === 'media' && !selectedFile) {
      alert("Please select a video or audio file first.");
      return;
    }
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Handle Layout Shift
    if (inputType === 'text') {
      mediaUploadSection.classList.add('hidden');
    } else if (inputType === 'media') {
      textInputSection.classList.add('hidden');
      leftColumn.appendChild(mediaUploadSection);
    }

    const idea = `
      Executive Summary:
      ${summary || "Not specified."}

      Problem Solved:
      ${problem || "Not specified."}

      Proposed Solution:
      ${solution || "Not specified."}

      Target Audience:
      ${audience || "Not specified."}
    `.trim();

    submitBtn.disabled = true;
    if(submitMediaBtn) submitMediaBtn.disabled = true;
    
    // Hide buttons during loading
    if(inputType === 'media' && submitMediaBtn) submitMediaBtn.classList.add('hidden');
    if(inputType === 'text' && submitBtn) submitBtn.classList.add('hidden');
    
    // Show back button
    if (resetPitchBtn) resetPitchBtn.classList.remove('hidden');

    resetResults();
    
    // Configure Simulation Mode
    const textScanner = document.getElementById('text-scanner');
    const audioScanner = document.getElementById('audio-scanner');
    
    if (inputType === 'media') {
      textScanner.classList.add('hidden');
      audioScanner.classList.remove('hidden');
      
      steps[0].innerHTML = "Transcribing & Diarizing Audio";
      steps[1].innerHTML = "Analyzing Vocal Tone & Literal Pitch";
      steps[2].innerHTML = "Cross-referencing Market Data";
      steps[3].innerHTML = "Generating Feedback";
    } else {
      textScanner.classList.remove('hidden');
      audioScanner.classList.add('hidden');
      
      steps[0].innerHTML = "Parsing Executive Summary";
      steps[1].innerHTML = "Cross-referencing Market Data";
      steps[2].innerHTML = "Evaluating Revenue Viability";
      steps[3].innerHTML = "Generating Feedback";
      
      let previewText = (summary || problem || solution || audience).substring(0, 180);
      simulatedText.textContent = previewText + '... \n\n[Extracting text features]';
    }

    // Start simulation steps
    function activateStep(index) {
      if(index > 0) {
        steps[index-1].classList.remove('active');
        steps[index-1].classList.add('complete');
      }
      if(index < steps.length) {
        steps[index].classList.add('active');
      }
    }
    
    activateStep(0);

    try {
      // We will perform fetch while simulating steps with artificial delay for visual effect
      const apiPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      
      // Artificial step delays
      await new Promise(r => setTimeout(r, 1000));
      activateStep(1);
      await new Promise(r => setTimeout(r, 1200));
      activateStep(2);
      await new Promise(r => setTimeout(r, 1000));
      activateStep(3);
      
      const response = await apiPromise;

      if (!response.ok) {
        throw new Error("Failed to analyze pitch.");
      }

      const data = await response.json();
      
      activateStep(4); // Completes last step
      await new Promise(r => setTimeout(r, 600)); // slight pause before showing results

      processingState.classList.add('hidden');
      resultsSection.classList.remove('hidden');

      if (data.type === 'questions') {
        renderQuestions(data.questions);
      } else if (data.type === 'analysis') {
        renderAnalysis(data.analysis);
      } else {
        throw new Error("Unknown response format.");
      }

    } catch (error) {
      processingState.classList.add('hidden');
      defaultState.classList.remove('hidden');
      alert("An error occurred while analyzing the pitch. Please try again.");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      if (submitMediaBtn) submitMediaBtn.disabled = false;
    }
  }

  function renderQuestions(questions) {
    questionsContainer.classList.remove('hidden');
    questionsList.innerHTML = questions
      .map(q => `<li>${q}</li>`)
      .join('');
  }

  function renderAnalysis(analysis) {
    analysisContainer.classList.remove('hidden');
    
    // Core Problem
    coreProblemEl.textContent = stripNumberPrefix(analysis.coreProblem);
    
    // Target Audience
    targetAudienceEl.textContent = stripNumberPrefix(analysis.targetAudience);
    
    // Proposed Solution
    proposedSolutionEl.textContent = stripNumberPrefix(analysis.proposedSolution);
    
    // Lean Plan
    leanPlanEl.innerHTML = analysis.leanPlan
      .map(item => `<li>${item}</li>`)
      .join('');
    
    // VC Questions
    vcQuestionsEl.innerHTML = analysis.vcQuestions
      .map(q => `
        <div class="question-block">
          <div class="question-title">${q.question}</div>
          <div class="question-note">${q.note}</div>
        </div>
      `)
      .join('');
  }

  // Gemini might include the '1. Core Problem:' prefix in the text since our prompt examples have it
  // This helper removes it if present to avoid duplication since it's already in the card header.
  function stripNumberPrefix(text) {
    if (!text) return "";
    return text.replace(/^[0-9]+.\s*[A-Za-z\s]+:\s*/, '').trim();
  }
});
