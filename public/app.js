document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');
  const ideaInput = document.getElementById('idea-input');
  
  const resultsSection = document.getElementById('results-section');
  const loadingDiv = document.getElementById('loading');
  const questionsContainer = document.getElementById('questions-container');
  const analysisContainer = document.getElementById('analysis-container');
  
  const questionsList = document.getElementById('questions-list');
  const coreProblemEl = document.getElementById('core-problem');
  const targetAudienceEl = document.getElementById('target-audience');
  const proposedSolutionEl = document.getElementById('proposed-solution');
  const leanPlanEl = document.getElementById('lean-plan');
  const vcQuestionsEl = document.getElementById('vc-questions');

  function resetResults() {
    resultsSection.classList.remove('hidden');
    loadingDiv.classList.remove('hidden');
    questionsContainer.classList.add('hidden');
    analysisContainer.classList.add('hidden');
    
    questionsList.innerHTML = '';
    coreProblemEl.innerHTML = '';
    targetAudienceEl.innerHTML = '';
    proposedSolutionEl.innerHTML = '';
    leanPlanEl.innerHTML = '';
    vcQuestionsEl.innerHTML = '';
  }

  submitBtn.addEventListener('click', async () => {
    const idea = ideaInput.value.trim();
    if (!idea) {
      alert("Please describe your startup idea first.");
      return;
    }

    submitBtn.disabled = true;
    resetResults();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idea })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze pitch.");
      }

      const data = await response.json();
      loadingDiv.classList.add('hidden');

      if (data.type === 'questions') {
        renderQuestions(data.questions);
      } else if (data.type === 'analysis') {
        renderAnalysis(data.analysis);
      } else {
        throw new Error("Unknown response format.");
      }

    } catch (error) {
      loadingDiv.classList.add('hidden');
      alert("An error occurred while analyzing the pitch. Please try again.");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
    }
  });

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
