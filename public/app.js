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

  let currentPitchType = 'startup';

  const typeConfig = {
    startup: {
      ideaLabel: "Executive Pitch Summary",
      ideaPlaceholder: "Start typing your pitch overview here...",
      problemLabel: "Problem Solved",
      problemPlaceholder: "What specific problem does this solve?",
      solutionLabel: "Proposed Solution",
      solutionPlaceholder: "How does your product uniquely solve this problem?",
      audienceLabel: "Target Audience",
      audiencePlaceholder: "Who is your target customer?",
      headers: {
        coreProblem: "1. Core Problem",
        targetAudience: "2. Target Audience",
        proposedSolution: "3. Proposed Solution",
        leanPlan: "4. Lean Plan",
        vcQuestions: "5. Tough VC Questions"
      }
    },
    career: {
      ideaLabel: "Professional Background",
      ideaPlaceholder: "Summarize your career journey and current role...",
      problemLabel: "Goal / Role Applied For",
      problemPlaceholder: "What position or goal are you aiming for?",
      solutionLabel: "Key Achievements & Value",
      solutionPlaceholder: "What makes you the best fit? Highlight key impacts.",
      audienceLabel: "Target Employer/Audience",
      audiencePlaceholder: "Who are you interviewing with (e.g. Hiring Manager, Panel)?",
      headers: {
        coreProblem: "1. Core Narrative",
        targetAudience: "2. Target Employer",
        proposedSolution: "3. Value Proposition",
        leanPlan: "4. Action Plan",
        vcQuestions: "5. Tough Interview Questions"
      }
    },
    academic: {
      ideaLabel: "Research Topic & Background",
      ideaPlaceholder: "Summarize the field and your specific topic...",
      problemLabel: "Research Problem / Gap",
      problemPlaceholder: "What is the gap in current knowledge?",
      solutionLabel: "Methodology & Results",
      solutionPlaceholder: "How did you study this and what did you find?",
      audienceLabel: "Target Audience",
      audiencePlaceholder: "e.g., Thesis Committee, Conference Attendees",
      headers: {
        coreProblem: "1. Research Gap",
        targetAudience: "2. Audience Context",
        proposedSolution: "3. Methodology & Findings",
        leanPlan: "4. Future Research / Timeline",
        vcQuestions: "5. Tough Committee Questions"
      }
    }
  };

  const typeButtons = document.querySelectorAll('.type-btn');
  const labelIdea = document.getElementById('label-idea');
  const labelProblem = document.getElementById('label-problem');
  const labelSolution = document.getElementById('label-solution');
  const labelAudience = document.getElementById('label-audience');
  const inputHelper = document.querySelector('.input-helper'); // The one under Idea

  typeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      typeButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      
      currentPitchType = target.dataset.type;
      const config = typeConfig[currentPitchType];

      // Update Labels
      if(labelIdea) labelIdea.textContent = config.ideaLabel;
      if(labelProblem) labelProblem.textContent = config.problemLabel;
      if(labelSolution) labelSolution.textContent = config.solutionLabel;
      if(labelAudience) labelAudience.textContent = config.audienceLabel;

      // Update Placeholders
      ideaInput.placeholder = config.ideaPlaceholder;
      problemInput.placeholder = config.problemPlaceholder;
      solutionInput.placeholder = config.solutionPlaceholder;
      audienceInput.placeholder = config.audiencePlaceholder;
      
      // Update Helper Text slightly
      if (inputHelper) {
        if (currentPitchType === 'startup') inputHelper.textContent = "Provide a high-level overview of your business idea.";
        if (currentPitchType === 'career') inputHelper.textContent = "Summarize your career arc and why you're pitching yourself.";
        if (currentPitchType === 'academic') inputHelper.textContent = "Provide context on your research and academic goals.";
      }
    });
  });

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
    
    const deliveryCritiqueContainer = document.getElementById('delivery-critique-container');
    if (deliveryCritiqueContainer) deliveryCritiqueContainer.classList.add('hidden');
    
    steps.forEach(s => s.className = 'pending');
    simulatedText.textContent = '';
    
    questionsList.innerHTML = '';
    coreProblemEl.innerHTML = '';
    targetAudienceEl.innerHTML = '';
    proposedSolutionEl.innerHTML = '';
    leanPlanEl.innerHTML = '';
    vcQuestionsEl.innerHTML = '';
    
    const deliveryCritiqueContent = document.getElementById('delivery-critique-content');
    if (deliveryCritiqueContent) deliveryCritiqueContent.innerHTML = '';
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
      let apiPromise;
      if (inputType === 'media') {
        // Read file as Base64
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            // result is something like "data:audio/mp3;base64,xxxx"
            const [metadata, base64] = result.split(',');
            const mimeType = metadata.match(/:(.*?);/)[1];
            resolve({ data: base64, mimeType });
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(selectedFile);
        });

        apiPromise = fetch('/api/analyze-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: fileData, pitchType: currentPitchType })
        });
      } else {
        apiPromise = fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, pitchType: currentPitchType })
        });
      }
      
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

      if (inputType === 'media') {
        // We show the delivery critique container instead of the JSON analysis
        analysisContainer.classList.add('hidden');
        questionsContainer.classList.add('hidden');
        
        const deliveryCritiqueContainer = document.getElementById('delivery-critique-container');
        const deliveryCritiqueContent = document.getElementById('delivery-critique-content');
        
        deliveryCritiqueContainer.classList.remove('hidden');
        
        // We use a custom markdown parser for the delivery critique text
        let formattedText = parseCritiqueMarkdown(data.text);
        deliveryCritiqueContent.innerHTML = formattedText;
      } else {
        if (data.type === 'questions') {
          renderQuestions(data.questions);
        } else if (data.type === 'analysis') {
          renderAnalysis(data.analysis);
        } else {
          throw new Error("Unknown response format.");
        }
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
    
    const config = typeConfig[currentPitchType].headers;
    
    // Core Problem
    const cpHeader = coreProblemEl.previousElementSibling;
    if(cpHeader) cpHeader.textContent = config.coreProblem;
    coreProblemEl.textContent = stripNumberPrefix(analysis.coreProblem);
    
    // Target Audience
    const taHeader = targetAudienceEl.previousElementSibling;
    if(taHeader) taHeader.textContent = config.targetAudience;
    targetAudienceEl.textContent = stripNumberPrefix(analysis.targetAudience);
    
    // Proposed Solution
    const psHeader = proposedSolutionEl.previousElementSibling;
    if(psHeader) psHeader.textContent = config.proposedSolution;
    proposedSolutionEl.textContent = stripNumberPrefix(analysis.proposedSolution);
    
    // Lean Plan
    const lpHeader = leanPlanEl.previousElementSibling;
    if(lpHeader) lpHeader.textContent = config.leanPlan;
    leanPlanEl.innerHTML = analysis.leanPlan
      .map(item => `<li>${item}</li>`)
      .join('');
    
    // VC Questions
    const vcHeader = vcQuestionsEl.previousElementSibling;
    if(vcHeader) vcHeader.textContent = config.vcQuestions;
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

  // Parses markdown text from AI critique into styled HTML
  function parseCritiqueMarkdown(text) {
    let html = text
      // Section headers like **DELIVERY SCORE: X/10**
      .replace(/^\s*\*\*(.*?)\*\*\s*$/gm, '<h3 class="critique-section-title">$1</h3>')
      // Inline strong
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li class="critique-li">$1</li>')
      .split('\n');

    let finalHtml = '';
    let inList = false;

    for (let line of html) {
      if (line.includes('<li class="critique-li">')) {
        if (!inList) {
          finalHtml += '<ul class="critique-list">';
          inList = true;
        }
        finalHtml += line;
      } else {
        if (inList) {
          finalHtml += '</ul>';
          inList = false;
        }
        let cleanLine = line.trim();
        if (cleanLine !== '') {
          if (!cleanLine.startsWith('<h3')) {
             finalHtml += `<p class="critique-p">${cleanLine}</p>`;
          } else {
             finalHtml += cleanLine;
          }
        }
      }
    }
    if (inList) finalHtml += '</ul>';

    return finalHtml;
  }

  // --- VOICE PITCHING (Microphone Input) ---
  const recordMicBtn = document.getElementById('record-mic-btn');
  const recordMicText = document.getElementById('record-mic-text');
  const recordingStatus = document.getElementById('recording-status');
  const recordingTimerEl = document.getElementById('recording-timer');
  const deliveryCritiqueContainer = document.getElementById('delivery-critique-container');
  const deliveryCritiqueContent = document.getElementById('delivery-critique-content');

  let isRecording = false;
  let recognition = null;
  let finalTranscript = '';
  let recordingStartTime = null;
  let timerInterval = null;

  // Filler words to detect
  const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "so", "actually", "literally"];

  if (recordMicBtn) {
    recordMicBtn.addEventListener('click', toggleRecording);
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `\${m}:\${s < 10 ? '0' : ''}\${s}`;
  }

  function calculateMetrics(transcript, durationSec) {
    const words = transcript.trim().split(/\\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    
    // Pace: words per minute
    const wordsPerMinute = durationSec > 0 ? Math.round((totalWords / durationSec) * 60) : 0;
    
    // Fillers count
    const fillerCounts = {};
    let totalFillers = 0;
    
    // Convert transcript to lowercase array for easier regex/matching
    const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Simple individual word fillers (um, uh, like, so, actually, literally, basically)
    lowerWords.forEach(w => {
      if (FILLER_WORDS.includes(w)) {
        fillerCounts[w] = (fillerCounts[w] || 0) + 1;
        totalFillers++;
      }
    });
    
    // Multi-word fillers like "you know"
    const transcriptLower = transcript.toLowerCase();
    const youKnowMatches = transcriptLower.match(/\\byou know\\b/g);
    if (youKnowMatches) {
      fillerCounts['you know'] = (fillerCounts['you know'] || 0) + youKnowMatches.length;
      totalFillers += youKnowMatches.length;
    }

    const fillerPercentage = totalWords > 0 ? ((totalFillers / totalWords) * 100).toFixed(1) : 0;

    // Stuttered words (back-to-back same word)
    const repeatedWords = [];
    for (let i = 0; i < lowerWords.length - 1; i++) {
      if (lowerWords[i] && lowerWords[i] === lowerWords[i + 1]) {
        // Exclude common valid consecutive words like "had had" or "that that", though for pitching it's usually stutters
        const stutter = `\${lowerWords[i]} \${lowerWords[i+1]}`;
        if (!repeatedWords.includes(stutter)) repeatedWords.push(stutter);
      }
    }

    // Repeated phrases (simple 3-gram back-to-back check as a fast heuristic)
    // Accurate repeated phrase detection can be complex, this is basic:
    const repeatedPhrases = [];
    for (let i = 0; i < lowerWords.length - 5; i++) {
        const trigram1 = `\${lowerWords[i]} \${lowerWords[i+1]} \${lowerWords[i+2]}`;
        const trigram2 = `\${lowerWords[i+3]} \${lowerWords[i+4]} \${lowerWords[i+5]}`;
        if (trigram1 === trigram2 && trigram1.trim().length > 3) {
            if (!repeatedPhrases.includes(trigram1)) repeatedPhrases.push(trigram1);
        }
    }

    return {
      totalWords,
      durationInSeconds: Math.round(durationSec),
      wordsPerMinute,
      totalFillers,
      fillerCounts,
      fillerPercentage,
      repeatedWords,
      repeatedPhrases
    };
  }

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    finalTranscript = '';
    
    recognition.onstart = () => {
      isRecording = true;
      recordingStartTime = Date.now();
      
      // Update UI
      recordMicBtn.classList.add('recording-active');
      recordMicText.innerHTML = "<strong>Stop Recording</strong>";
      recordingStatus.classList.remove('hidden');
      
      // Timer Loop
      timerInterval = setInterval(() => {
        const elapsedSec = (Date.now() - recordingStartTime) / 1000;
        recordingTimerEl.textContent = formatTime(elapsedSec);
      }, 1000);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // We could display interim transcript if we had a dedicated text box for it
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if(event.error === 'not-allowed') {
        alert("Microphone access was denied. Please allow microphone access to record your pitch.");
        stopRecording(true);
      }
    };

    recognition.onend = () => {
      // If stopped naturally or by error, ensure we clean up
      if(isRecording) stopRecording();
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  }

  async function stopRecording(cancel = false) {
    isRecording = false;
    clearInterval(timerInterval);
    
    if (recognition) {
      recognition.stop();
    }

    // Reset UI
    recordMicBtn.classList.remove('recording-active');
    recordMicText.textContent = "Record Pitch (Microphone)";
    recordingStatus.classList.add('hidden');
    recordingTimerEl.textContent = "0:00";

    if (cancel) return;

    const durationSec = (Date.now() - recordingStartTime) / 1000;
    if (finalTranscript.trim().length === 0 || durationSec < 2) {
      alert("Recording was too short or no speech was detected. Please try again.");
      return;
    }

    const metrics = calculateMetrics(finalTranscript, durationSec);
    console.log("Recorded Transcript:", finalTranscript);
    console.log("Calculated Metrics:", metrics);

    await submitVoicePitch(finalTranscript, metrics);
  }

  async function submitVoicePitch(transcript, metrics) {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    textInputSection.classList.add('hidden');
    leftColumn.appendChild(mediaUploadSection);
    
    submitBtn.disabled = true;
    if(submitMediaBtn) submitMediaBtn.disabled = true;
    recordMicBtn.disabled = true;
    
    if (resetPitchBtn) resetPitchBtn.classList.remove('hidden');

    resetResults();
    
    const textScanner = document.getElementById('text-scanner');
    const audioScanner = document.getElementById('audio-scanner');
    
    textScanner.classList.add('hidden');
    audioScanner.classList.remove('hidden');
    
    steps[0].innerHTML = "Transcribing & Diarizing Audio";
    steps[1].innerHTML = "Analyzing Vocal Tone & Literal Pitch";
    steps[2].innerHTML = "Evaluating Delivery Mechanics";
    steps[3].innerHTML = "Generating Critical Feedback";

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
      const apiPromise = fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, metrics, pitchType: currentPitchType })
      });
      
      // Artificial step delays for presentation
      await new Promise(r => setTimeout(r, 1000));
      activateStep(1);
      await new Promise(r => setTimeout(r, 1200));
      activateStep(2);
      await new Promise(r => setTimeout(r, 1000));
      activateStep(3);
      
      const response = await apiPromise;

      if (!response.ok) {
        throw new Error("Failed to analyze voice pitch.");
      }

      const data = await response.json();
      
      activateStep(4); 
      await new Promise(r => setTimeout(r, 600));

      processingState.classList.add('hidden');
      resultsSection.classList.remove('hidden');
      
      // We only show the new delivery critique container for voice pitch
      deliveryCritiqueContainer.classList.remove('hidden');
      
      // Render text (since it's markdown, doing string replace for basic formatting is good enough if we don't have a library)
      let formattedText = data.text
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\n/g, '<br/>');
        
      deliveryCritiqueContent.innerHTML = formattedText;

    } catch (error) {
      processingState.classList.add('hidden');
      defaultState.classList.remove('hidden');
      alert("An error occurred while analyzing the pitch delivery. Please try again.");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      if (submitMediaBtn) submitMediaBtn.disabled = false;
      recordMicBtn.disabled = false;
    }
  }

});

