import React, { useState, useEffect } from 'react';
// Importing icons from Lucide React
import { Book, Search, MessageSquare, Repeat, PenTool, Users, Lightbulb } from 'lucide-react'; // Added Lightbulb icon for prompts

// Data for the flashcards, now with grade-differentiated examples and sample prompts
const flashcardData = [
    {
        activityType: "1. Acquisition",
        description: "Learners listen, read, or watch to grasp concepts. This involves receiving information.",
        teacherActivities: {
            preK3: {
                text: "Generate simple stories with repetitive elements for early readers; create printable coloring pages that introduce new vocabulary; produce short, engaging audio clips for listening comprehension, **with varied voices to aid auditory processing (desirable difficulty)**.",
                prompt: "**Action**: Generate a simple story with repetitive elements. **Purpose**: To help Pre-K to 3rd graders learn [NEW_VOCABULARY_WORD] and **practice retrieval**. **Expectation**: The story should be about [TOPIC], feature [CHARACTER_TYPE], be no more than [NUMBER] sentences long, and ask [NUMBER] simple retrieval questions about the story's events. Highlight the repetitive phrase."
            },
            grade4_6: {
                text: "Generate summaries of historical events or science topics at a 4-6 grade reading level; design interactive quizzes with picture-based answers; develop scripts for short educational puppet shows. **Intersperse quizzes within longer summaries to encourage active processing (desirable difficulty).**",
                prompt: "**Action**: Summarize the historical event. **Purpose**: To help 4th-6th graders understand [HISTORICAL_EVENT] and **improve retention through spaced practice**. **Expectation**: The summary should be at a 4th-6th grade reading level, cover [KEY_POINTS], be around [NUMBER] paragraphs. Include [NUMBER] multiple-choice quiz questions with image suggestions, placed every [NUMBER] paragraphs to break up the reading."
            },
            grade7_10: {
                text: "Generate concise summaries of complex literary texts or scientific articles; create differentiated reading passages at various levels of complexity for a given topic; design interactive quizzes with automated feedback focusing on factual recall and comprehension. **Vary the format of generated summaries (e.g., bullet points, narrative, concept map outlines) to encourage flexible thinking (desirable difficulty).**",
                prompt: "**Action**: Generate a concise summary. **Purpose**: To help 7th-10th graders grasp the main concepts of [SCIENTIFIC_ARTICLE_TITLE/LITERARY_TEXT] and **enhance understanding through varied encoding**. **Expectation**: The summary should be no more than [NUMBER] words, highlighting [MAIN_ARGUMENT/KEY_FINDINGS]. Provide [NUMBER] versions: one bulleted, one narrative, and one as a concept map outline. Also, provide [NUMBER] differentiated reading passages from this summary at a [READING_LEVEL] and [READING_LEVEL] complexity."
            },
            grade11_12: {
                text: "Generate detailed synopses of academic papers or dense historical documents; create sophisticated reading passages with advanced vocabulary for specific subjects; develop video scripts for in-depth instructional content (e.g., advanced physics concepts, economic theories); produce realistic, multi-faceted case studies for high-level analysis. **Introduce subtle inconsistencies or missing information in case studies to prompt deeper investigation and critical evaluation (desirable difficulty).**",
                prompt: "**Action**: Develop a video script for instructional content. **Purpose**: To explain [ADVANCED_PHYSICS_CONCEPT/ECONOMIC_THEORY] to 11th-12th graders and **foster critical thinking**. **Expectation**: The script should be approximately [DURATION] minutes long, include explanations of [SUB_TOPICS], and incorporate visuals suggestions. Generate a realistic, multi-faceted case study related to this concept for analysis, including [NUMBER] subtle ambiguities or gaps that require students to infer or research further."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Students can ask GenAI to tell a story about animals or a specific theme; use it to learn new simple words with definitions and pictures; ask for 'what comes next' in a simple sequence. **GenAI can occasionally introduce a new, slightly more complex word to gently expand vocabulary (desirable difficulty).**",
                prompt: "**Action**: Tell me a story. **Purpose**: To help me learn about [ANIMAL_TYPE/THEME] and **expand my vocabulary**. **Expectation**: The story should be short and have pictures to help me understand new words like [WORD_1], [WORD_2]. Occasionally introduce one new word slightly above my current level and explain it with simple context."
            },
            grade4_6: {
                text: "Students can ask GenAI to explain concepts like 'photosynthesis' in simpler terms; summarize short articles about animals or planets; generate practice questions on multiplication or grammar rules. **GenAI can provide questions that require retrieval from earlier parts of the explanation (desirable difficulty).**",
                prompt: "**Action**: Explain [CONCEPT_NAME] to me. **Purpose**: To help me understand it easily and **practice active recall**. **Expectation**: Explain it like I'm in [GRADE_LEVEL], using simple words and giving [NUMBER] examples related to [TOPIC]. After the explanation, ask me [NUMBER] questions that require me to remember key details without looking back immediately."
            },
            grade7_10: {
                text: "Students can ask GenAI to explain concepts in simpler terms or from different angles; summarize long articles or chapters; generate practice questions on a topic with hints; create flashcards for vocabulary or key facts; or produce alternative explanations for difficult mathematical or scientific material. **GenAI can present concepts from a slightly different perspective after the initial explanation to encourage deeper processing (desirable difficulty).**",
                prompt: "**Action**: Generate practice questions. **Purpose**: To help me study for my [SUBJECT] test on [TOPIC] and **improve long-term retention**. **Expectation**: Provide [NUMBER] multiple-choice questions with hints, and then give me the answers at the end. After I answer, provide an alternative explanation of the concept from a slightly different angle to reinforce learning. Focus on [SPECIFIC_AREA_OF_TOPIC]."
            },
            grade11_12: {
                text: "Students can ask GenAI for deeper explanations of abstract concepts; request detailed summaries of research papers or complex theories; generate advanced practice problems (e.g., calculus, organic chemistry) with step-by-step solutions; create comprehensive digital flashcards with complex definitions and examples; or use it to explore different theoretical frameworks for a given topic. **GenAI can provide related but distinct problems (interleaved practice) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Action**: Explain [ABSTRACT_CONCEPT/THEORY] in depth. **Purpose**: To provide a comprehensive understanding for my [CLASS_NAME] assignment and **strengthen my problem-solving skills**. **Expectation**: Explain the concept from [PERSPECTIVE_1] and [PERSPECTIVE_2], discuss its implications in [FIELD_1] and [FIELD_2]. Offer [NUMBER] detailed examples to illustrate its application, then provide [NUMBER] interleaved practice problems that require applying this concept along with [RELATED_CONCEPT_1] and [RELATED_CONCEPT_2]."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers define learning goals (Human), GenAI generates varied resources (AI), and students critically evaluate, select, and discuss content (Human)." ,
        icon: <Book className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "2. Investigation",
        description: "Learners explore, question, and research, often to solve problems or understand phenomena. This involves active inquiry.",
        teacherActivities: {
            preK3: {
                text: "Create simple 'mystery boxes' with clues for students to guess an object; generate 'what if' scenarios about animal habitats; design scavenger hunts for colors or shapes around the classroom. **GenAI can generate 'mystery' elements that require simple inference rather than direct fact recall (desirable difficulty).**",
                prompt: "**Action**: Generate 'what if' scenarios. **Purpose**: To spark curiosity in Pre-K to 3rd graders about [ANIMAL_HABITAT] and **encourage inferential thinking**. **Expectation**: Create [NUMBER] simple scenarios, like 'What if [ANIMAL] lived in [UNUSUAL_PLACE]?' Each scenario should have a simple question for discussion that requires students to make a logical guess based on the 'what if'."
            },
            grade4_6: {
                text: "Generate open-ended research prompts about local ecosystems or historical figures; create simplified hypothetical scenarios or datasets about weather patterns or animal migration for students to analyze; design simple 'detective' games requiring students to gather information. **GenAI can provide slightly ambiguous initial information in scenarios, requiring students to ask clarifying questions (desirable difficulty).**",
                prompt: "**Action**: Generate open-ended research prompts. **Purpose**: To guide 4th-6th graders in investigating [LOCAL_ECOSYSTEM/HISTORICAL_FIGURE] and **promote critical questioning**. **Expectation**: Provide [NUMBER] prompts that encourage research beyond simple facts, focusing on 'how' or 'why'. Suggest simple resources for them to explore. For one scenario, include a piece of information that is slightly incomplete or vague, prompting students to ask clarifying questions."
            },
            grade7_10: {
                text: "Curate diverse digital resources (articles, basic datasets, simple simulations) tailored to a specific inquiry question (e.g., 'What factors influence climate?'); generate open-ended research prompts requiring data collection and analysis; create hypothetical scenarios or datasets for students to analyze (e.g., analyzing population trends, scientific experiment results); or design escape rooms/puzzles that require investigation and problem-solving to solve. **GenAI can present slightly contradictory 'expert' opinions in a scenario to encourage source evaluation (desirable difficulty).**",
                prompt: "**Action**: Generate hypothetical scenarios. **Purpose**: To help 7th-10th graders analyze [TOPIC_AREA_E.G._POPULATION_TRENDS] and **develop critical evaluation skills**. **Expectation**: Create [NUMBER] detailed scenarios, each with a small dataset or set of variables. Include questions that require students to analyze trends and make predictions based on the provided data. For one scenario, include two brief 'expert' statements that are subtly contradictory, requiring students to identify the conflict and propose a resolution."
            },
            grade11_12: {
                text: "Curate extensive and diverse resources (peer-reviewed articles, complex datasets, advanced simulations) for in-depth inquiry (e.g., 'Analyzing the socio-economic impacts of climate change'); generate complex, multi-faceted research prompts requiring critical evaluation of sources; create intricate hypothetical scenarios or large-scale datasets for students to rigorously analyze and draw conclusions; or design elaborate digital 'cold case' simulations requiring advanced investigative techniques. **GenAI can introduce irrelevant or distracting information into resource sets to train information filtering (desirable difficulty).**",
                prompt: "**Action**: Design an elaborate digital 'cold case' simulation. **Purpose**: To engage 11th-12th graders in advanced investigative techniques for [HISTORICAL_EVENT/SCIENTIFIC_MYSTERY] and **train information filtering**. **Expectation**: Create a narrative with [NUMBER] key 'clues' (e.g., historical documents, scientific data snippets). The simulation should require students to synthesize information, formulate hypotheses, and justify their conclusions based on the evidence. Include [NUMBER] pieces of information that are plausible but ultimately irrelevant to the core mystery, requiring students to discern key data."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Students can ask GenAI to suggest things to find in the classroom; ask 'why' questions about simple observations; get ideas for what to build with blocks. **GenAI can pose a 'why' question after an observation, encouraging simple causal thinking (desirable difficulty).**",
                prompt: "**Action**: Ask me 'why' questions about observations. **Purpose**: To help me think about [SIMPLE_OBSERVATION, E.G._WHY_DO_LEAVES_FALL]. **Expectation**: Ask me [NUMBER] 'why' questions about common things I see, and then give a simple answer after I try."
            },
            grade4_6: {
                text: "Students can use GenAI to brainstorm simple research questions like 'How do plants grow?'; find basic facts about historical events; generate ideas for science fair projects; simulate simple scenarios like 'What if the sun disappeared?'. **GenAI can prompt students to justify their initial assumptions in simulations (desirable difficulty).**",
                prompt: "**Action**: Simulate a simple scenario. **Purpose**: To help me understand [CONCEPT_NAME] through active prediction. **Expectation**: Simulate 'What if the sun disappeared?'. Before revealing the outcome, ask me to predict [NUMBER] things that would happen and explain why I think so."
            },
            grade7_10: {
                text: "Students can use GenAI to brainstorm research questions for a science project or history report; find diverse perspectives on a current event; generate hypotheses for scientific experiments; simulate basic scenarios (e.g., 'What if we double the population?'); analyze small datasets (by asking GenAI to process and summarize key trends); or practice critical thinking by challenging GenAI's initial answers or suggesting alternative interpretations. **GenAI can offer a critique of a student's initial hypothesis, prompting refinement (desirable difficulty).**",
                prompt: "**Action**: Generate hypotheses for an experiment. **Purpose**: To help me design an experiment on [SCIENTIFIC_TOPIC]. **Expectation**: Provide [NUMBER] testable hypotheses related to [DEPENDENT_VARIABLE] and [INDEPENDENT_VARIABLE]. After I propose my own hypothesis, provide a constructive critique pointing out a potential flaw or area for refinement, and suggest [NUMBER] ways to collect data for each."
            },
            grade11_12: {
                text: "Students can use GenAI to refine complex research questions for dissertations or capstone projects; find nuanced, academic perspectives on contentious issues; generate sophisticated hypotheses for advanced research; run complex simulations (e.g., economic models, biological systems); process and interpret large, multivariate datasets; or engage in advanced critical thinking by debating GenAI's conclusions and exploring logical fallacies. **GenAI can intentionally introduce a common logical fallacy into a simulated debate point, requiring the student to identify and refute it (desirable difficulty).**",
                prompt: "**Action**: Refine my research question. **Purpose**: To make my capstone project question on [BROAD_TOPIC] more focused and academic and **to identify logical fallacies**. **Expectation**: Review my current question: '[YOUR_CURRENT_QUESTION]'. Suggest [NUMBER] ways to narrow its scope, add academic rigor, and make it more suitable for a [TYPE_OF_PROJECT_E.G._DISSERTATION]. In our simulated debate, introduce [NUMBER] arguments that contain a common logical fallacy (e.g., straw man, ad hominem) for me to identify and refute."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers pose open-ended problems (Human), GenAI helps explore possibilities and gather initial data (AI), and students analyze, synthesize, and present findings (Human)." ,
        icon: <Search className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "3. Discussion",
        description: "Learners articulate their understanding, challenge ideas, and engage in dialogue with peers or the teacher. This fosters collaborative meaning-making.",
        teacherActivities: {
            preK3: {
                text: "Generate simple prompts for 'show and tell'; create scenarios for sharing toys; suggest sentence starters for polite disagreements ('I hear you, but I think...'). **GenAI can generate prompts that require students to listen to a peer's idea and then add a related, but different, thought (desirable difficulty).**",
                prompt: "**Action**: Generate simple prompts. **Purpose**: To encourage 'show and tell' discussions for Pre-K to 3rd graders and **promote active listening**. **Expectation**: Provide [NUMBER] prompts that are easy to understand. For each prompt, include a follow-up instruction like 'After [PEER_NAME] shares, tell us something similar or different you think about their object'."
            },
            grade4_6: {
                text: "Generate discussion prompts for classroom debates on topics like 'Should we have school uniforms?'; create simple character personas for role-playing a historical event; simulate a friendly argument about a book's ending. **GenAI can provide slightly incomplete arguments for personas, requiring students to fill in the gaps with their own reasoning (desirable difficulty).**",
                prompt: "**Action**: Generate discussion prompts. **Purpose**: To facilitate a classroom debate for 4th-6th graders on [DEBATE_TOPIC] and **develop argumentative skills**. **Expectation**: Provide [NUMBER] prompts that cover both sides of the argument and encourage students to use evidence. Also, create [NUMBER] simple character personas related to the topic for role-playing, where each persona's argument has one missing logical step for students to complete."
            },
            grade7_10: {
                text: "Generate thought-provoking discussion prompts for debates or small group work on controversial topics (e.g., ethical dilemmas in science, historical interpretations); create detailed personas for role-playing discussions (e.g., historical figures, different scientific viewpoints, characters from literature); simulate a short, guided conversation on a specific topic for students to analyze; or provide balanced counter-arguments for students to critically evaluate and refute. **GenAI can simulate a peer's argument that contains a common misconception, prompting students to identify and correct it (desirable difficulty).**",
                prompt: "**Action**: Generate detailed personas for role-playing discussion. **Purpose**: To facilitate a rich discussion among 7th-10th graders on [CONTROVERSIAL_TOPIC] and **hone critical reasoning**. **Expectation**: Create [NUMBER] personas, each with a distinct viewpoint and background. Provide talking points for each. In one persona's talking points, include a common misconception related to the topic for students to identify and politely correct during the discussion."
            },
            grade11_12: {
                text: "Generate complex discussion prompts requiring nuanced argumentation for Socratic seminars or advanced debates (e.g., philosophical concepts, policy implications); create intricate personas with specific motivations and backstories for in-depth role-playing (e.g., UN delegates, legal teams); simulate extended, multi-turn discussions on highly controversial or abstract topics for students to dissect; or provide sophisticated, well-reasoned counter-arguments to push students' critical thinking and rebuttal skills. **GenAI can introduce unexpected data or ethical dilemmas during a simulated discussion to force real-time adaptation of arguments (desirable difficulty).**",
                prompt: "**Action**: Generate complex discussion prompts. **Purpose**: To prepare for a Socratic seminar with 11th-12th graders on [PHILOSOPHICAL_CONCEPT/POLICY_IMPLICATION] and **promote adaptive argumentation**. **Expectation**: Provide [NUMBER] open-ended questions that encourage nuanced argumentation and critical thinking. Include questions that explore ethical dimensions and real-world relevance. During a simulated discussion, unexpectedly introduce a new piece of data or an unforeseen ethical dilemma that requires students to adapt their initial arguments."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Students can ask GenAI for ideas to talk about with a friend; practice telling a story to GenAI; get suggestions for how to share with others. **GenAI can prompt the student to retell a story in their own words after hearing it, encouraging recall (desirable difficulty).**",
                prompt: "**Action**: Tell me a story. **Purpose**: To help me practice telling stories. **Expectation**: Tell me a short story about [TOPIC], then ask me to tell it back to you in my own words. Give me feedback on how well I remembered the main parts."
            },
            grade4_6: {
                text: "Students can engage GenAI in a simple debate about their favorite animal; ask for different opinions on a story character; practice explaining a science concept to GenAI. **GenAI can ask 'why' questions about the student's opinions to encourage justification (desirable difficulty).**",
                prompt: "**Action**: Have a simple debate with me. **Purpose**: To practice my arguing skills about [FAVORITE_ANIMAL/TOPIC] and **justify my reasoning**. **Expectation**: Argue against my choice, giving me [NUMBER] reasons why [OPPOSITE_VIEW] is better. After I give my response, ask me 'Why do you think that?' or 'Can you give me an example?'"
            },
            grade7_10: {
                text: "Students can engage GenAI as a debate partner on a specific topic, receiving basic counter-arguments; ask for multiple perspectives on a social issue or historical event; receive instant feedback on the clarity and coherence of their arguments; practice articulating their thoughts and structuring responses before a real discussion; or use it to explore different sides of a complex issue by generating pro/con lists. **GenAI can provide feedback that points out logical gaps or asks for more evidence (desirable difficulty).**",
                prompt: "**Action**: Engage me as a debate partner. **Purpose**: To practice my arguments for [DEBATE_TOPIC] and **improve logical coherence**. **Expectation**: Present a basic counter-argument to my point: '[YOUR_POINT]'. If my response lacks evidence or has a logical gap, point it out and ask for clarification or more support. Provide [NUMBER] different perspectives on [SOCIAL_ISSUE] and explain each briefly."
            },
            grade11_12: {
                text: "Students can engage GenAI in advanced debates on complex academic or ethical issues, requesting nuanced counter-arguments and challenging its logic; ask for a wide range of sophisticated perspectives on a given topic; receive detailed, constructive feedback on their logical reasoning, rhetorical devices, and persuasive language; rehearse complex presentations or legal arguments with GenAI; or use it to thoroughly explore the multifaceted aspects of a high-level academic or real-world problem. **GenAI can intentionally present a subtly flawed argument for the student to identify and articulate its weakness (desirable difficulty).**",
                prompt: "**Action**: Engage me in an advanced debate. **Purpose**: To refine my arguments on [COMPLEX_ETHICAL_ISSUE] and **diagnose logical flaws**. **Expectation**: Challenge my statement: '[YOUR_ARGUMENT]'. Provide a nuanced counter-argument, highlighting potential logical fallacies or alternative interpretations. In one of your counter-arguments, deliberately include a subtle logical flaw (e.g., equivocation, false dilemma) and see if I can identify and articulate its weakness."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers set discussion norms (Human), GenAI provides initial prompts or different viewpoints (AI), and students engage in meaningful peer-to-peer dialogue (Human)." ,
        icon: <MessageSquare className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "4. Practice",
        description: "Learners perform tasks repeatedly to develop skills and consolidate knowledge, often receiving feedback.",
        teacherActivities: {
            preK3: {
                text: "Create endless variations of number matching games; generate simple drawing prompts; produce alphabet tracing worksheets. **GenAI can introduce slightly varied examples in a drill set (e.g., different fonts, object types) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Action**: Generate simple drawing prompts. **Purpose**: To encourage creative practice for Pre-K to 3rd graders and **promote flexible application**. **Expectation**: Provide [NUMBER] prompts like 'Draw a [ANIMAL] with [NUMBER] eyes' or 'Draw your favorite [COLOR] monster'. For number matching, vary the representation (e.g., dots, fingers, numerals) for each set."
            },
            grade4_6: {
                text: "Create unlimited variations of math problems (addition, subtraction, multiplication, division); generate simple grammar exercises (e.g., identifying nouns and verbs); design scenarios for role-play practice (e.g., ordering food, asking for directions). **GenAI can interleave different types of math problems or grammar rules within a single practice set (desirable difficulty).**",
                prompt: "**Action**: Create unlimited variations of math problems. **Purpose**: To provide practice for 4th-6th graders on [MATH_OPERATION, E.G._MULTIPLICATION] and **encourage interleaving**. **Expectation**: Generate [NUMBER] problems with solutions. Include a mix of single and multi-digit numbers. For practice, interleave multiplication, division, and addition problems rather than doing one type at a time. Also, create a short role-play scenario for [SITUATION_E.G._ORDERING_FOOD]."
            },
            grade7_10: {
                text: "Create unlimited variations of practice problems for math (algebra, geometry), grammar (sentence structure, punctuation), or coding exercises (simple functions, loops); generate realistic scenarios for role-play practice (e.g., customer service, negotiations, job interviews); design adaptive quizzes that adjust difficulty based on student performance; or produce examples of common errors and correct solutions for analysis. **GenAI can generate feedback that forces students to explain *why* their answer is wrong before providing the correct solution (desirable difficulty).**",
                prompt: "**Action**: Create realistic scenarios for role-play practice. **Purpose**: To help 7th-10th graders prepare for a [SITUATION_E.G._JOB_INTERVIEW] and **deepen self-correction**. **Expectation**: Provide [NUMBER] detailed scenarios, including the role of the interviewer, potential questions, and challenges. For each scenario, generate [NUMBER] common errors students might make. When a student makes an error, prompt them to explain *why* it's an error before revealing the correct solution."
            },
            grade11_12: {
                text: "Create an endless supply of complex practice problems for advanced math (calculus, statistics), intricate grammar and stylistic exercises (e.g., advanced essay structures, rhetorical analysis), or sophisticated coding challenges (e.g., algorithms, data structures); generate highly realistic and nuanced scenarios for role-play (e.g., complex business negotiations, medical diagnoses, legal arguments); design highly adaptive, personalized learning paths with intelligent quizzes that target individual weaknesses; or produce detailed examples of expert-level solutions and common pitfalls for deep learning and self-correction. **GenAI can provide immediate but minimal feedback, requiring students to elaborate on their thought process to receive more detailed guidance (desirable difficulty).**",
                prompt: "**Action**: Design a highly adaptive, personalized learning path. **Purpose**: To help 11th-12th graders master [COMPLEX_TOPIC_E.G._CALCULUS_INTEGRATION] and **promote self-explanation**. **Expectation**: The path should include [NUMBER] modules. For each module, generate [NUMBER] intelligent quiz questions. When a student answers incorrectly, first ask them to explain their reasoning before providing any hints or the full solution. Include expert-level solutions and common pitfalls for each type of problem."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Students can ask GenAI for more counting games; practice saying letters or words; get ideas for how to build a tower. **GenAI can occasionally introduce a slight variation in the counting game (e.g., counting backwards, skip counting by 2s) (desirable difficulty).**",
                prompt: "**Action**: Give me a counting game. **Purpose**: To help me practice counting to [NUMBER] and **build counting flexibility**. **Expectation**: Make it a fun game where I count [OBJECTS] and you tell me if I'm right. Occasionally, ask me to count backwards from [NUMBER] or skip count by [NUMBER]."
            },
            grade4_6: {
                text: "Students can request more math problems; get immediate feedback on their spelling; practice reading aloud to GenAI. **GenAI can present math problems where the unknown is in a different position (e.g., blank on left vs. right) to encourage deeper understanding (desirable difficulty).**",
                prompt: "**Action**: Give me [NUMBER] math problems. **Purpose**: To practice [MATH_SKILL, E.G._LONG_DIVISION] and **develop conceptual understanding**. **Expectation**: The problems should be suitable for a [GRADE_LEVEL] student. After each problem, tell me if my answer is correct and explain how to solve it if I get it wrong. Include problems where the missing number is not always the answer, e.g., '5 + ? = 10'."
            },
            grade7_10: {
                text: "Students can request endless practice problems in any subject (e.g., solving quadratic equations, conjugating verbs, writing basic code functions); get immediate, specific feedback on their attempts (e.g., identifying logical errors in code, suggesting grammatical corrections in an essay); practice speaking a new language with a conversational AI by engaging in simulated dialogues; rehearse presentations or speeches, receiving feedback on pacing and clarity; or refine their writing by asking for suggestions on tone, clarity, and conciseness for different audiences. **GenAI can introduce 'just right' challenges in language practice, requiring slightly more complex sentence structures or vocabulary than previously used (desirable difficulty).**",
                prompt: "**Action**: Practice speaking [LANGUAGE_NAME] with me. **Purpose**: To improve my conversational skills for a [SITUATION_E.G._TRAVELING_ABROAD] and **expand my linguistic repertoire**. **Expectation**: Engage in a [NUMBER]-turn dialogue about [TOPIC]. Give me feedback on my grammar and pronunciation after each of my responses. In a later turn, prompt me to use a specific, slightly more complex grammar structure or vocabulary word that we haven't used yet."
            },
            grade11_12: {
                text: "Students can request highly challenging and specialized practice problems (e.g., proofs in abstract algebra, advanced essay critiques, debugging complex software); receive detailed, analytical feedback on their performance, including alternative approaches and deeper conceptual explanations; engage in sophisticated language practice, including nuanced cultural expressions and formal discourse; rehearse critical professional presentations or interviews, receiving feedback on strategic communication; or use GenAI for deep refinement of academic papers, including argumentation, stylistic elegance, and adherence to specific disciplinary conventions. **GenAI can provide feedback that forces students to articulate the *underlying principle* behind a correction, rather data than just accepting the fix (desirable difficulty).**",
                prompt: "**Action**: Critique my [TYPE_OF_PAPER_E.G._RESEARCH_ESSAY]. **Purpose**: To refine my arguments and writing style for [ACADEMIC_COURSE] and **deepen my understanding of writing principles**. **Expectation**: Analyze the logical flow of my arguments, identify any rhetorical weaknesses, and suggest improvements for stylistic elegance and adherence to [SPECIFIC_DISCIPLINARY_CONVENTION]. When suggesting a correction, also ask me to explain the principle (e.g., 'Why is this sentence clearer now?') behind the improvement."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers introduce skills (Human), GenAI offers varied practice and instant feedback (AI), and students reflect on performance and apply skills in new contexts (Human)." ,
        icon: <Repeat className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "5. Production",
        description: "Learners create artifacts (essays, presentations, projects, code) to demonstrate their understanding. This involves applying knowledge creatively.",
        teacherActivities: {
            preK3: {
                text: "Generate ideas for simple art projects; provide templates for drawing a house or an animal; suggest lyrics for a class song. **GenAI can generate prompts for art projects that require students to combine two unrelated elements (desirable difficulty).**",
                prompt: "**Action**: Generate ideas for simple art projects. **Purpose**: To spark creativity in Pre-K to 3rd graders for [THEME_E.G._SPRING] and **encourage divergent thinking**. **Expectation**: Provide [NUMBER] ideas that use common classroom materials like [MATERIALS]. Include a prompt that asks students to draw a [ANIMAL] doing something unusual, like '[ANIMAL] riding a bicycle'."
            },
            grade4_6: {
                text: "Generate initial templates or outlines for simple reports (e.g., book reports, science project outlines); provide example structures for different text types (e.g., persuasive letters, descriptive paragraphs); suggest creative project ideas (e.g., building a model, creating a comic book); or offer starter code snippets for very basic programming tasks (e.g., in Scratch). **GenAI can provide a scaffolded template that gradually reduces support across multiple tasks (desirable difficulty).**",
                prompt: "**Action**: Generate an outline for a report. **Purpose**: To help 4th-6th graders structure their [TYPE_OF_REPORT_E.G._BOOK_REPORT] and **build independent outlining skills**. **Expectation**: The outline should include [NUMBER] main sections: [SECTION_1], [SECTION_2], [SECTION_3]. Provide example sentences for a persuasive letter about [TOPIC]. For a subsequent report, provide an outline that is less detailed, requiring students to fill in more structure themselves."
            },
            grade7_10: {
                text: "Generate initial templates or outlines for various assignments (essays, reports, presentations, creative writing pieces); provide example structures for different text types (e.g., argumentative essays, research papers, persuasive speeches); suggest creative project ideas based on learning objectives (e.g., designing a public awareness campaign, creating a short film script); or offer starter code snippets and debugging hints for programming tasks in various languages. **GenAI can provide feedback on a draft that requires students to justify *why* they made certain stylistic choices (desirable difficulty).**",
                prompt: "**Action**: Generate an outline for an argumentative essay. **Purpose**: To help 7th-10th graders structure their essay on [ESSAY_TOPIC] and **promote rhetorical awareness**. **Expectation**: The outline should include an introduction with a clear thesis, [NUMBER] body paragraphs with topic sentences, and a conclusion. Provide a starter code snippet for a simple [PROGRAMMING_TASK_E.G._PYTHON_FUNCTION] that relates to [TOPIC]. When providing feedback on a draft, ask students to explain the reasoning behind their choice of [SPECIFIC_LITERARY_DEVICE/ARGUMENT_STRUCTURE]."
            },
            grade11_12: {
                text: "Generate advanced templates or detailed outlines for complex academic assignments (e.g., thesis proposals, scientific lab reports, literary analyses, business plans); provide sophisticated example structures for highly specialized text types (e.g., grant proposals, legal briefs, technical specifications); suggest innovative and interdisciplinary project ideas (e.g., designing a sustainable urban model, developing a new scientific hypothesis); or offer advanced starter code, architectural patterns, and debugging support for complex software development projects. **GenAI can provide feedback that challenges students to reframe their argument for a different, potentially more skeptical, audience (desirable difficulty).**",
                prompt: "**Action**: Generate a detailed outline for a thesis proposal. **Purpose**: To assist 11th-12th graders in structuring their research on [THESIS_TOPIC] and **develop persuasive adaptation skills**. **Expectation**: The outline should include sections for abstract, literature review, methodology, expected outcomes, and bibliography. Provide examples of how to phrase research questions for a [SCIENTIFIC_LAB_REPORT] and typical architectural patterns for a [SOFTWARE_PROJECT]. After a student drafts a section, ask them to rephrase it to appeal to a highly skeptical audience."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Students can use GenAI for ideas for their drawings; ask for help making up a story; get suggestions for things to build. **GenAI can ask 'what else could you add?' after a simple creation, encouraging elaboration (desirable difficulty).**",
                prompt: "**Action**: Give me ideas for my drawing. **Purpose**: To help me draw a [OBJECT/ANIMAL] and **encourage elaboration**. **Expectation**: Suggest [NUMBER] different ways to draw a [OBJECT/ANIMAL], and include ideas for [COLORS] to use. After I tell you what I drew, ask me 'What else could you add to make it even more interesting?'"
            },
            grade4_6: {
                text: "Students can use GenAI for brainstorming ideas for creative writing or science projects; generating simple outlines for their reports; getting help with structuring a story; receiving suggestions for improving sentences; or generating initial drafts of short paragraphs that they then edit. **GenAI can prompt students to combine two distinct ideas into one cohesive paragraph (desirable difficulty).**",
                prompt: "**Action**: Brainstorm ideas for a creative writing piece. **Purpose**: To help me start writing a story about [GENRE_E.G._FANTASY] and **integrate diverse concepts**. **Expectation**: Suggest [NUMBER] plot ideas, [NUMBER] character ideas, and [NUMBER] setting ideas. Give me a simple outline for a [TYPE_OF_STORY_E.G._ADVENTURE_STORY]. Then, ask me to combine the idea of a [IDEA_1] with a [IDEA_2] into a single paragraph."
            },
            grade7_10: {
                text: "Students can use GenAI for brainstorming ideas for projects or essays, generating outlines, getting help with structuring their arguments, receiving suggestions for improving their writing style, translating ideas into different formats (e.g., detailed notes to a presentation script), or generating initial drafts that they then refine. **GenAI can offer feedback that requires students to diagnose the *root cause* of a grammatical error, not just correct it (desirable difficulty).**",
                prompt: "**Action**: Generate an outline. **Purpose**: To help me structure my [TYPE_OF_ESSAY_E.G._ARGUMENTATIVE_ESSAY] on [ESSAY_TOPIC] and **master grammatical principles**. **Expectation**: The outline should include an introduction with a clear thesis, [NUMBER] body paragraphs, and a conclusion. Suggest [NUMBER] ways to improve my writing style, focusing on [ASPECT_E.G._VARIED_SENTENCE_STRUCTURE]. If I make a grammatical error, point out the error and ask me to identify the rule I violated before giving the correct version."
            },
            grade11_12: {
                text: "Students can use GenAI for advanced brainstorming and ideation for complex research papers or capstone projects; generating detailed, multi-section outlines; receiving sophisticated guidance on argumentative structures, logical flow, and persuasive techniques; translating complex data or research findings into compelling narratives or presentation formats; or generating robust initial code structures, allowing them to focus on algorithm implementation and creative problem-solving. **GenAI can provide feedback that requires students to explain the *trade-offs* of different design choices in their production (desirable difficulty).**",
                prompt: "**Action**: Provide sophisticated guidance on argumentative structures. **Purpose**: To refine the argumentative flow of my [TYPE_OF_PAPER_E.G._RESEARCH_PAPER] on [TOPIC] and **evaluate design trade-offs**. **Expectation**: Analyze my current argumentative structure (provide a summary if possible), and suggest [NUMBER] alternative structures (e.g., classical, Rogerian, Toulmin), explaining the strengths and weaknesses of each for my topic. Also, provide a robust initial code structure for a [SOFTWARE_TYPE_E.G._WEB_APPLICATION] to manage [DATA_TYPE]. For a design choice, ask me to explain the pros and cons of an alternative approach."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers provide project guidelines (Human), GenAI assists with brainstorming and drafting (AI), and students finalize, personalize, and present their original work (Human)." ,
        icon: <PenTool className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "6. Collaboration",
        description: "Learners work together to achieve a shared goal, often involving co-creation and negotiation.",
        teacherActivities: {
            preK3: {
                text: "Suggest simple group activities; generate ideas for sharing toys; create songs about teamwork. **GenAI can suggest collaborative tasks that require students to physically move and re-group based on a changing criteria (desirable difficulty).**",
                prompt: "**Action**: Suggest simple group activities. **Purpose**: To encourage teamwork among Pre-K to 3rd graders for [CLASS_ACTIVITY] and **promote adaptive grouping**. **Expectation**: Provide [NUMBER] ideas that involve sharing, simple decision-making, and a clear group goal. Include an activity where students initially group by [CRITERIA_1] (e.g., favorite color), then re-group by [CRITERIA_2] (e.g., shoe color) for the next step of the activity."
            },
            grade4_6: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for simple group projects (e.g., a class play, a science presentation); suggest roles for group members (e.g., researcher, presenter, artist); create shared document templates for collaborative writing assignments (e.g., group story); or design simple problems that require students to combine their knowledge. **GenAI can intentionally introduce a minor conflicting requirement within a problem to necessitate negotiation (desirable difficulty).**",
                prompt: "**Action**: Facilitate brainstorming session ideas. **Purpose**: To help 4th-6th graders kickstart a group project on [PROJECT_TOPIC] and **encourage negotiation**. **Expectation**: Generate [NUMBER] diverse project ideas. For each idea, suggest [NUMBER] roles (e.g., researcher, presenter) that students can take. Also, provide a simple template for a collaborative group story about [THEME]. In one problem, include two requirements that are slightly at odds, forcing the group to discuss and compromise."
            },
            grade7_10: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for group projects; suggest roles and responsibilities for group members; create shared document templates for collaborative writing or project planning; or design complex problems that genuinely require multiple perspectives and shared understanding to solve effectively. **GenAI can simulate a group member who subtly shifts their position, requiring active listening and adaptive responses (desirable difficulty).**",
                prompt: "**Action**: Design a complex problem for collaborative solving. **Purpose**: To challenge 7th-10th graders to work together on [SUBJECT_AREA_E.G._ENVIRONMENTAL_SCIENCE] and **develop dynamic collaboration skills**. **Expectation**: Create a problem scenario that requires combining knowledge from [DISCIPLINE_1] and [DISCIPLINE_2]. Suggest [NUMBER] roles (e.g., data analyst, communicator) for group members and provide a template for a shared project plan. During a simulated group meeting, one 'member' (GenAI) should subtly change their stance on a key issue, requiring the group to adapt their argument or approach."
            },
            grade11_12: {
                text: "Facilitate advanced brainstorming sessions for highly complex, interdisciplinary group projects; dynamically suggest specialized roles based on team strengths and project needs; create sophisticated collaborative workspace templates (e.g., integrated planning, research, and drafting modules); or design wicked problems and grand challenges that demand authentic collaboration, negotiation, and synthesis of diverse expertise. **GenAI can introduce an unexpected external constraint or resource change during a project, forcing the group to pivot their strategy (desirable difficulty).**",
                prompt: "**Action**: Design a wicked problem for authentic collaboration. **Purpose**: To engage 11th-12th graders in a grand challenge related to [GLOBAL_ISSUE] and **foster strategic adaptation**. **Expectation**: Create a multi-faceted problem that requires interdisciplinary expertise (e.g., economics, sociology, engineering). Dynamically suggest [NUMBER] specialized roles (e.g., policy analyst, systems engineer) based on potential team strengths, and provide a template for an integrated planning and research module within a collaborative workspace. Midway through the simulated project, introduce a new, significant external constraint (e.g., budget cut, new regulation) that requires the group to completely re-evaluate and adapt their strategy."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers define collaborative tasks (Human), GenAI facilitates idea sharing and initial organization (AI), and students collaboratively develop, refine, and present shared outcomes (Human)." ,
        icon: <Users className="text-violet-500 mb-3" size={48} />
    }
];

// Grade level buttons component
const GradeLevelSelector = ({ selectedGrade, onSelectGrade }) => {
    const grades = [
        { label: "Pre-K - 3", key: "preK3" },
        { label: "4 - 6", key: "grade4_6" },
        { label: "7 - 10", key: "grade7_10" },
        { label: "11 - 12", key: "grade11_12" }
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {grades.map((grade) => (
                <button
                    key={grade.key}
                    onClick={() => onSelectGrade(grade.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200
                        ${selectedGrade === grade.key
                            ? 'bg-violet-700 text-white shadow-md'
                            : 'bg-white text-violet-700 border border-violet-300 hover:bg-violet-100'
                        }`}
                >
                    {grade.label}
                </button>
            ))}
        </div>
    );
};

// PromptModal Component for displaying the sample prompt
const PromptModal = ({ promptText, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative transform scale-100 opacity-100 transition-all duration-300 ease-out">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sample GenAI Prompt</h3>
                <div className="bg-gray-100 p-4 rounded-md border border-gray-200 text-gray-700 text-sm leading-relaxed overflow-auto max-h-64">
                    <pre className="whitespace-pre-wrap font-mono text-gray-700 select-all"> {/* select-all makes it easily highlightable */}
                        {promptText.split(' ').map((word, index) => (
                            word.startsWith('[') && word.endsWith(']') ? (
                                <strong key={index} className="text-blue-600 font-semibold">{word} </strong>
                            ) : (
                                <span key={index}>{word} </span>
                            )
                        ))}
                    </pre>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    Highlight and copy the text above. Remember to edit the bracketed parts for your specific context!
                </p>
            </div>
        </div>
    );
};


// HomePage component where users can select an activity type
const HomePage = ({ onSelectActivity }) => {
    return (
        <div className="p-4 sm:p-6 md:p-8 w-full max-w-4xl pt-20"> {/* Added pt-20 to push content below fixed header */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-800 mb-8 text-center drop-shadow-md">
                Choose a Learning Activity to Explore
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardData.map((card, index) => (
                    <div
                        key={index}
                        className="homepage-card cursor-pointer flex flex-col justify-between" // Use homepage-card class
                        onClick={() => onSelectActivity(index)}
                    >
                        {card.icon} {/* Display the icon */}
                        <h3 className="text-xl sm:text-2xl font-semibold text-violet-700 mb-3">
                            {card.activityType}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                            {card.description}
                        </p>
                        <button className="self-start text-violet-500 hover:text-violet-700 font-medium transition-colors duration-200">
                            Learn More →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// FlashcardView component to display the interactive flashcards
const FlashcardView = ({ initialIndex, onGoBack }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState('grade7_10'); // Default to 7-10
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState('');

    // Reset flipped state and set initial grade when currentIndex or initialIndex changes
    useEffect(() => {
        setIsFlipped(false);
        if (initialIndex !== currentIndex) {
            setSelectedGrade('grade7_10');
        }
    }, [currentIndex, initialIndex]);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcardData.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcardData.length) % flashcardData.length);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSelectGrade = (gradeKey) => {
        setSelectedGrade(gradeKey);
        // Keep the card flipped if it was already flipped
    };

    const handleGeneratePrompt = (promptContent) => {
        setCurrentPrompt(promptContent);
        setShowPromptModal(true);
    };

    const handleClosePromptModal = () => {
        setShowPromptModal(false);
        setCurrentPrompt('');
    };

    const currentCard = flashcardData[currentIndex];

    // Get grade-specific activities and prompts, falling back to general messages
    const getTeacherActivities = () => {
        const data = currentCard.teacherActivities[selectedGrade];
        return data ? data.text : "No specific teacher activities for this grade level yet. Showing general examples.";
    };

    const getTeacherPrompt = () => {
        const data = currentCard.teacherActivities[selectedGrade];
        return data ? data.prompt : "No sample prompt available for this grade level and activity type.";
    };

    const getStudentInteractions = () => {
        const data = currentCard.studentInteractions[selectedGrade];
        return data ? data.text : "No specific student interactions for this grade level yet. Showing general examples.";
    };

    const getStudentPrompt = () => {
        const data = currentCard.studentInteractions[selectedGrade];
        return data ? data.prompt : "No sample prompt available for this grade level and activity type.";
    };


    return (
        <div className="flex flex-col items-center justify-center p-4 w-full pt-20 flex-grow">
            <button
                onClick={onGoBack}
                className="back-button mb-6 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold bg-violet-600 hover:bg-violet-700 transform hover:scale-105"
            >
                ← Back to Home
            </button>

            <GradeLevelSelector selectedGrade={selectedGrade} onSelectGrade={handleSelectGrade} />

            <div className="flashcard-container mb-8 w-full max-w-2xl">
                <div
                    className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleFlip}
                >
                    {/* Front of the flashcard */}
                    <div className="flashcard-face flashcard-front flex flex-col justify-content-start items-center p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">
                            {currentCard.activityType}
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                            {currentCard.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-4">
                            Click to reveal how GenAI supports this!
                        </p>
                    </div>

                    {/* Back of the flashcard */}
                    <div className="flashcard-face flashcard-back flex flex-col overflow-y-auto p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {currentCard.activityType}
                        </h2>
                        <div className="mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold mt-1 mb-0.5 text-indigo-200">
                                Teacher-made Activities ({selectedGrade.replace('grade','Gr. ').replace('_','-').replace('PreK','Pre-K')}):
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-indigo-100 mb-2">
                                {getTeacherActivities()}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleGeneratePrompt(getTeacherPrompt()); }}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-white text-violet-700 hover:bg-violet-100 transition-colors shadow-sm mt-2 min-w-[120px]"
                            >
                                <Lightbulb className="w-4 h-4 mr-1 text-violet-700" />
                                Get Prompt
                            </button>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold mt-1 mb-0.5 text-indigo-200">
                                Student Interaction ({selectedGrade.replace('grade','Gr. ').replace('_','-').replace('PreK','Pre-K')}):
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-indigo-100 mb-2">
                                {getStudentInteractions()}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleGeneratePrompt(getStudentPrompt()); }}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-white text-violet-700 hover:bg-violet-100 transition-colors shadow-sm mt-2 min-w-[120px]"
                            >
                                <Lightbulb className="w-4 h-4 mr-1 text-violet-700" />
                                Get Prompt
                            </button>
                        </div>
                         <div>
                            <h3 className="text-lg sm:text-xl font-semibold mt-1 mb-0.5 text-indigo-200">
                                Human-AI-Human Tip:
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-indigo-100 italic">
                                {currentCard.humanAiHumanTip}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center w-full max-w-md">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="control-button"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === flashcardData.length - 1}
                    className="control-button"
                >
                    Next
                </button>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
                <p>Flashcard {currentIndex + 1} of {flashcardData.length}</p>
            </div>

            {showPromptModal && (
                <PromptModal promptText={currentPrompt} onClose={handleClosePromptModal} />
            )}
        </div>
    );
};


// The main App component for the interactive flashcards
const App = () => {
    const [view, setView] = useState('home'); // 'home' or 'flashcards'
    const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);

    const handleSelectActivity = (index) => {
        setSelectedActivityIndex(index);
        setView('flashcards');
    };

    const handleGoBack = () => {
        setView('home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center p-0 font-sans antialiased">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                /* Fixed header styling */
                .fixed-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #ffffff; /* White background for the header */
                    padding: 1rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Softer shadow */
                    z-index: 1000; /* Ensure it stays on top */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .flashcard-container {
                    perspective: 1000px; /* Establishes a 3D perspective */
                    width: 100%;
                    max-width: 600px;
                    /* Adjusted height to allow content to scroll more freely */
                    height: clamp(300px, 70vh, 500px); /* Responsive height, min 300px, max 500px, ideally 70% viewport height */
                    margin-bottom: 2rem; /* Increased margin for better spacing */
                }
                .flashcard {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d; /* Ensures 3D transformations apply to children */
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); /* Smooth flip animation */
                }
                .flashcard.flipped {
                    transform: rotateY(180deg); /* Rotate for the flip effect */
                }
                .flashcard-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden; /* Hides the back of the element when facing away */
                    display: flex;
                    flex-direction: column; /* Changed to column for better vertical flow */
                    justify-content: flex-start; /* Align content to start, not center */
                    align-items: center; /* Keep horizontal items centered for front face */
                    border-radius: 1.5rem; /* rounded-3xl */
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); /* Softer, more subtle shadow */
                    padding: 1.5rem; /* p-6 */
                    text-align: center;
                    overflow-y: auto; /* Ensure content within the face is scrollable if it overflows */
                    background-color: #ffffff; /* Always white for front */
                }
                .flashcard-front {
                    color: #4a5568; /* text-gray-700 */
                }
                .flashcard-back {
                    background-color: #7c3aed; /* A slightly softer violet */
                    color: #ffffff; /* text-white */
                    transform: rotateY(180deg); /* Initially rotated for the back face */
                    display: flex; /* Ensure flex properties for the back face content */
                    flex-direction: column;
                    align-items: flex-start; /* Align content to the start */
                    text-align: left; /* Ensure text alignment for back content */
                    padding: 2rem; /* Adjusted padding for back face */
                    overflow-y: auto; /* Ensure content within the face is scrollable if it overflows */
                }
                /* Adjust spacing for content within the back of the flashcard */
                .flashcard-back .mb-4 {
                    margin-bottom: 1rem;
                }
                .flashcard-back .mb-2 {
                    margin-bottom: 0.5rem;
                }

                .flashcard-title {
                    font-size: 1.875rem; /* text-3xl */
                    font-weight: 700; /* font-bold */
                    margin-bottom: 1rem; /* mb-4 */
                }
                .flashcard-description {
                    font-size: 1.125rem; /* text-lg */
                    line-height: 1.75rem; /* leading-relaxed */
                }
                .flashcard-details-heading {
                    font-size: 1.25rem; /* text-xl */
                    font-weight: 600; /* font-semibold */
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    color: #e0e7ff; /* indigo-200 */
                }
                .flashcard-details-content {
                    font-size: 1rem; /* text-base */
                    line-height: 1.5rem; /* leading-relaxed */
                    text-align: left;
                }
                .control-button {
                    background-image: linear-gradient(to right, #7c3aed 0%, #a78bfa  51%, #7c3aed  100%); /* Softer gradient */
                    margin: 10px;
                    padding: 15px 45px;
                    text-align: center;
                    text-transform: uppercase;
                    transition: 0.5s;
                    background-size: 200% auto;
                    color: white;
                    box-shadow: 0 4px 10px rgba(124, 58, 237, 0.2); /* Softer purple shadow */
                    border-radius: 10px;
                    display: block;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transform: scale(1);
                    transition: transform 0.2s ease-in-out;
                }
                .control-button:hover {
                    background-position: right center; /* change the direction of the change on hover */
                    color: #fff;
                    text-decoration: none;
                    transform: scale(1.03); /* Slightly less intense scale */
                }
                .control-button:disabled {
                    background-image: none;
                    background-color: #cccccc;
                    box-shadow: none;
                    cursor: not-allowed;
                    transform: scale(1);
                }
                .footer-citation {
                    margin-top: 4rem;
                    font-size: 0.875rem; /* text-sm */
                    color: #6b7280; /* gray-500 */
                    text-align: center;
                    padding: 1rem;
                    max-width: 800px;
                }
                /* Homepage card specific styling */
                .homepage-card {
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 1rem; /* Softer rounded corners */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); /* Lighter shadow */
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                .homepage-card:hover {
                    transform: translateY(-5px); /* Subtle lift */
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Slightly more prominent shadow on hover */
                }
                `}
            </style>

            {/* Fixed Header Banner */}
            <header className="fixed-header">
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 drop-shadow-lg text-center">
                    GenAI x Learning Activity Types
                </h1>
            </header>

            {/* Main content wrapper with padding to account for fixed header */}
            <div className="flex flex-col items-center justify-center min-h-screen-minus-header p-4" style={{ paddingTop: '80px', flexGrow: 1 }}>
                {view === 'home' ? (
                    <HomePage onSelectActivity={handleSelectActivity} />
                ) : (
                    <FlashcardView initialIndex={selectedActivityIndex} onGoBack={handleGoBack} />
                )}

                <footer className="footer-citation">
                    <p>
                        Gerta, A. (n.d.). *Diana Laurillard’s Six Learning Types: The Summary and Examples*. Gerta. Retrieved from{' '}
                        <a href="https://gerta.eu/diana-laurilliards-six-learning-types-the-summary-and-examples/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            https://gerta.eu/diana-laurilliards-six-learning-types-the-summary-and-examples/
                        </a>
                    </p>
                    <p className="mt-2 text-gray-500 text-xs">Co-created with Google Gemini</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
