import React, { useState, useEffect } from 'react';
// Importing icons from Lucide React
import { Book, Search, MessageSquare, Repeat, PenTool, Users, Lightbulb, Home } from 'lucide-react'; // Added Lightbulb icon for prompts, and Home icon

// Data for the flashcards, now with grade-differentiated examples and sample prompts
const flashcardData = [
    {
        activityType: "1. Acquisition",
        description: "Learners listen, read, or watch to grasp concepts. This involves receiving information.",
        teacherActivities: {
            preK3: {
                text: "Generate simple stories with repetitive elements for early readers; create printable coloring pages that introduce new vocabulary; produce short, engaging audio clips for listening comprehension, **with varied voices to aid auditory processing (desirable difficulty)**.",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my Pre-K to 3rd graders recognize sight words']. **Action**: Generate a simple story with repetitive elements. **Purpose**: To help Pre-K to 3rd graders learn [NEW_VOCABULARY_WORD] and **practice retrieval**. **Expectation**: The story should be about [TOPIC], feature [CHARACTER_TYPE], be no more than [NUMBER] sentences long, and ask [NUMBER] simple retrieval questions about the story's events. Highlight the repetitive phrase."
            },
            grade4_6: {
                text: "Generate summaries of historical events or science topics at a 4-6 grade reading level; design interactive quizzes with picture-based answers; develop scripts for short educational puppet shows. **Intersperse quizzes within longer summaries to encourage active processing (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my 4th-6th graders understand basic scientific processes']. **Action**: Summarize the historical event. **Purpose**: To help 4th-6th graders understand [HISTORICAL_EVENT] and **improve retention through spaced practice**. **Expectation**: The summary should be at a 4th-6th grade reading level, cover [KEY_POINTS], be around [NUMBER] paragraphs. Include [NUMBER] multiple-choice quiz questions with image suggestions, placed every [NUMBER] paragraphs to break up the reading."
            },
            grade7_10: {
                text: "Generate concise summaries of complex literary texts or scientific articles; create differentiated reading passages at various levels of complexity for a given topic; design interactive quizzes with automated feedback focusing on factual recall and comprehension. **Vary the format of generated summaries (e.g., bullet points, narrative, concept map outlines) to encourage flexible thinking (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To enhance my 7th-10th graders' ability to synthesize information from complex texts']. **Action**: Generate a concise summary. **Purpose**: To help 7th-10th graders grasp the main concepts of [SCIENTIFIC_ARTICLE_TITLE/LITERARY_TEXT] and **enhance understanding through varied encoding**. **Expectation**: The summary should be no more than [NUMBER] words, highlighting [MAIN_ARGUMENT/KEY_FINDINGS]. Provide [NUMBER] versions: one bulleted, one narrative, and one as a concept map outline. Also, provide [NUMBER] differentiated reading passages from this summary at a [READING_LEVEL] and [READING_LEVEL] complexity."
            },
            grade11_12: {
                text: "Generate detailed synopses of academic papers or dense historical documents; create sophisticated reading passages with advanced vocabulary for specific subjects; develop video scripts for in-depth instructional content (e.g., advanced physics concepts, economic theories); produce realistic, multi-faceted case studies for high-level analysis. **Introduce subtle inconsistencies or missing information in case studies to prompt deeper investigation and critical evaluation (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To foster critical evaluation skills in my 11th-12th graders']. **Action**: Develop a video script for instructional content. **Purpose**: To explain [ADVANCED_PHYSICS_CONCEPT/ECONOMIC_THEORY] to 11th-12th graders and **foster critical thinking**. **Expectation**: The script should be approximately [DURATION] minutes long, include explanations of [SUB_TOPICS], and incorporate visuals suggestions. Generate a realistic, multi-faceted case study related to this concept for analysis, including [NUMBER] subtle ambiguities or gaps that require students to infer or research further."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can ask GenAI to explain concepts in simpler terms or from different angles; summarize long articles or chapters; generate practice questions on a topic with hints; create flashcards for vocabulary or key facts; or produce alternative explanations for difficult mathematical or scientific material. **GenAI can present concepts from a slightly different perspective after the initial explanation to encourage deeper processing (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To prepare for my upcoming science test on cells']. **Action**: Generate practice questions. **Purpose**: To help me study for my [SUBJECT, e.g., Biology] test on [TOPIC, e.g., cell structure] and **improve long-term retention**. **Expectation**: Provide [NUMBER] multiple-choice questions with hints. After I answer, GenAI will provide feedback on my thinking, and if incorrect, an alternative explanation of the concept from a slightly different angle to reinforce learning. Focus on [SPECIFIC_AREA_OF_TOPIC, e.g., organelles]."
            },
            grade11_12: {
                text: "Students can ask GenAI for deeper explanations of abstract concepts; request detailed summaries of research papers or complex theories; generate advanced practice problems (e.g., calculus, organic chemistry) with step-by-step solutions; create comprehensive digital flashcards with complex definitions and examples; or use it to explore different theoretical frameworks for a given topic. **GenAI can provide related but distinct problems (interleaved practice) to prevent rote memorization (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To grasp the nuances of quantum mechanics']. **Action**: Explain [ABSTRACT_CONCEPT/THEORY, e.g., string theory] in depth. **Purpose**: To provide a comprehensive understanding for my [CLASS_NAME, e.g., Advanced Physics] assignment and **strengthen my problem-solving skills**. **Expectation**: Explain the concept from [PERSPECTIVE_1, e.g., a theoretical physicist's view] and [PERSPECTIVE_2, e.g., a practical applications view], discuss its implications in [FIELD_1, e.g., cosmology] and [FIELD_2, e.g., quantum computing]. Offer [NUMBER] detailed examples. GenAI will then provide [NUMBER] interleaved practice problems that require applying this concept along with [RELATED_CONCEPT_1, e.g., general relativity] and [RELATED_CONCEPT_2, e.g., quantum field theory] to prevent rote memorization and enhance my critical thinking."
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
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To encourage my Pre-K to 3rd graders to ask scientific questions']. **Action**: Generate 'what if' scenarios. **Purpose**: To spark curiosity in Pre-K to 3rd graders about [ANIMAL_HABITAT, e.g., rainforests] and **encourage inferential thinking**. **Expectation**: Create [NUMBER] simple scenarios. Each scenario will have a simple question for discussion, prompting students to make a logical guess based on the 'what if' without direct fact recall, guided by GenAI."
            },
            grade4_6: {
                text: "Generate open-ended research prompts about local ecosystems or historical figures; create simplified hypothetical scenarios or datasets about weather patterns or animal migration for students to analyze; design simple 'detective' games requiring students to gather information. **GenAI can provide slightly ambiguous initial information in scenarios, requiring students to ask clarifying questions (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To develop research skills in my 4th-6th graders']. **Action**: Generate open-ended research prompts. **Purpose**: To guide 4th-6th graders in investigating [LOCAL_ECOSYSTEM/HISTORICAL_FIGURE, e.g., the local river ecosystem] and **promote critical questioning**. **Expectation**: Provide [NUMBER] prompts that encourage research beyond simple facts, focusing on 'how' or 'why'. GenAI will also provide slightly ambiguous initial information in scenarios, requiring students to ask clarifying questions to enhance their inquiry skills."
            },
            grade7_10: {
                text: "Curate diverse digital resources (articles, basic datasets, simple simulations) tailored to a specific inquiry question (e.g., 'What factors influence climate?'); generate open-ended research prompts requiring data collection and analysis; create hypothetical scenarios or datasets for students to analyze (e.g., analyzing population trends, scientific experiment results); or design escape rooms/puzzles that require investigation and problem-solving to solve. **GenAI can present slightly contradictory 'expert' opinions in a scenario to encourage source evaluation (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve data analysis and evaluation in my 7th-10th graders']. **Action**: Generate hypothetical scenarios. **Purpose**: To help 7th-10th graders analyze [TOPIC_AREA_E.G._POPULATION_TRENDS, e.g., global population growth] and **develop critical evaluation skills**. **Expectation**: Create [NUMBER] detailed scenarios, each with a small dataset or set of variables. Include questions that require students to analyze trends and make predictions. GenAI will present slightly contradictory 'expert' opinions in a scenario to encourage critical source evaluation and deeper thinking."
            },
            grade11_12: {
                text: "Curate extensive and diverse resources (peer-reviewed articles, complex datasets, advanced simulations) for in-depth inquiry (e.g., 'Analyzing the socio-economic impacts of climate change'); generate complex, multi-faceted research prompts requiring critical evaluation of sources; create intricate hypothetical scenarios or large-scale datasets for students to rigorously analyze and draw conclusions; or design elaborate digital 'cold case' simulations requiring advanced investigative techniques. **GenAI can introduce irrelevant or distracting information into resource sets to train information filtering (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To enhance advanced investigative and information filtering skills']. **Action**: Design an elaborate digital 'cold case' simulation. **Purpose**: To engage 11th-12th graders in advanced investigative techniques for [HISTORICAL_EVENT/SCIENTIFIC_MYSTERY, e.g., the disappearance of the Roanoke colony] and **train information filtering**. **Expectation**: Create a narrative with [NUMBER] key 'clues'. The simulation will require students to synthesize information, formulate hypotheses, and justify their conclusions. GenAI will introduce irrelevant or distracting information to train information filtering and enhance critical data analysis."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can use GenAI to brainstorm research questions for a science project or history report; find diverse perspectives on a current event; generate hypotheses for scientific experiments; simulate basic scenarios (e.g., 'What if we double the population?'); analyze small datasets (by asking GenAI to process and summarize key trends); or practice critical thinking by challenging GenAI's initial answers or suggesting alternative interpretations. **GenAI can offer a critique of a student's initial hypothesis, prompting refinement (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To formulate strong scientific hypotheses for my science fair project']. **Action**: Generate hypotheses for an experiment. **Purpose**: To help me design an experiment on [SCIENTIFIC_TOPIC, e.g., plant growth]. **Expectation**: Provide [NUMBER] testable hypotheses related to [DEPENDENT_VARIABLE, e.g., height] and [INDEPENDENT_VARIABLE, e.g., amount of light]. After I propose my own hypothesis, GenAI will provide a constructive critique pointing out a potential flaw or area for refinement, guiding my scientific thought process."
            },
            grade11_12: {
                text: "Students can use GenAI to refine complex research questions for dissertations or capstone projects; find nuanced, academic perspectives on contentious issues; generate sophisticated hypotheses for advanced research; run complex simulations (e.g., economic models, biological systems); process and interpret large, multivariate datasets; or engage in advanced critical thinking by debating GenAI's conclusions and exploring logical fallacies. **GenAI can intentionally introduce a common logical fallacy into a simulated debate point, requiring the student to identify and refute it (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To refine my research questions and identify logical fallacies']. **Action**: Refine my research question. **Purpose**: To make my capstone project question on [BROAD_TOPIC, e.g., the impact of social media on society] more focused and academic and **to identify logical fallacies**. **Expectation**: GenAI will review my current question: '[YOUR_CURRENT_QUESTION, e.g., Is social media bad?'. It will suggest [NUMBER] ways to narrow its scope, add academic rigor, and make it more suitable for a [TYPE_OF_PROJECT_E.G._DISSERTATION, e.g., senior thesis]. In our simulated debate, GenAI will introduce [NUMBER] arguments that contain a common logical fallacy for me to identify and refute, enhancing my critical thinking skills."
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
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To foster polite classroom discussions']. **Action**: Generate simple prompts. **Purpose**: To encourage 'show and tell' discussions for Pre-K to 3rd graders and **promote active listening**. **Expectation**: Provide [NUMBER] prompts that are easy to understand. For each prompt, include a follow-up instruction like 'After [PEER_NAME] shares, tell us something similar or different you think about their object', which GenAI will help facilitate."
            },
            grade4_6: {
                text: "Generate discussion prompts for classroom debates on topics like 'Should we have school uniforms?'; create simple character personas for role-playing a historical event; simulate a friendly argument about a book's ending. **GenAI can provide slightly incomplete arguments for personas, requiring students to fill in the gaps with their own reasoning (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To develop respectful debate skills in my 4th-6th graders']. **Action**: Generate discussion prompts. **Purpose**: To facilitate a classroom debate for 4th-6th graders on [DEBATE_TOPIC, e.g., whether homework should be banned] and **develop argumentative skills**. **Expectation**: Provide [NUMBER] prompts that cover both sides of the argument. GenAI will also create [NUMBER] simple character personas, with each persona's argument having one missing logical step for students to complete with their own reasoning, enhancing their critical thinking."
            },
            grade7_10: {
                text: "Generate thought-provoking discussion prompts for debates or small group work on controversial topics (e.g., ethical dilemmas in science, historical interpretations); create detailed personas for role-playing discussions (e.g., historical figures, different scientific viewpoints, characters from literature); simulate a short, guided conversation on a specific topic for students to analyze; or provide balanced counter-arguments for students to critically evaluate and refute. **GenAI can simulate a peer's argument that contains a common misconception, prompting students to identify and correct it (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve critical reasoning and discussion in my 7th-10th graders']. **Action**: Generate detailed personas for role-playing discussion. **Purpose**: To facilitate a rich discussion among 7th-10th graders on [CONTROVERSIAL_TOPIC, e.g., gene editing ethics] and **hone critical reasoning**. **Expectation**: Create [NUMBER] personas with distinct viewpoints. In one persona's talking points, GenAI will include a common misconception related to the topic, prompting students to identify and politely correct it during the discussion, fostering deeper engagement."
            },
            grade11_12: {
                text: "Generate complex discussion prompts requiring nuanced argumentation for Socratic seminars or advanced debates (e.g., philosophical concepts, policy implications); create intricate personas with specific motivations and backstories for in-depth role-playing (e.g., UN delegates, legal teams); simulate extended, multi-turn discussions on highly controversial or abstract topics for students to dissect; or provide sophisticated, well-reasoned counter-arguments to push students' critical thinking and rebuttal skills. **GenAI can introduce unexpected data or ethical dilemmas during a simulated discussion to force real-time adaptation of arguments (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To prepare my 11th-12th graders for advanced academic discussions']. **Action**: Generate complex discussion prompts. **Purpose**: To prepare for a Socratic seminar with 11th-12th graders on [PHILOSOPHICAL_CONCEPT/POLICY_IMPLICATION, e.g., the philosophy of free will] and **promote adaptive argumentation**. **Expectation**: Provide [NUMBER] open-ended questions that encourage nuanced argumentation and critical thinking. GenAI will introduce a new piece of data or an unforeseen ethical dilemma during a simulated discussion, requiring students to adapt their initial arguments in real-time."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can engage GenAI as a debate partner on a specific topic, receiving basic counter-arguments; ask for multiple perspectives on a social issue or historical event; receive instant feedback on the clarity and coherence of their arguments; practice articulating their thoughts and structuring responses before a real discussion; or use it to explore different sides of a complex issue by generating pro/con lists. **GenAI can provide feedback that points out logical gaps or asks for more evidence (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve my debate arguments on climate change']. **Action**: Engage me as a debate partner. **Purpose**: To practice my arguments for [DEBATE_TOPIC, e.g., climate change policies] and **improve logical coherence**. **Expectation**: GenAI will present a basic counter-argument to my point: '[YOUR_POINT, e.g., Renewable energy is the only solution]'. If my response lacks evidence or has a logical gap, GenAI will point it out and ask for clarification or more support, guiding me to stronger arguments. GenAI will also provide [NUMBER] different perspectives on [SOCIAL_ISSUE, e.g., gentrification] and explain each briefly."
            },
            grade11_12: {
                text: "Students can engage GenAI in advanced debates on complex academic or ethical issues, requesting nuanced counter-arguments and challenging its logic; ask for a wide range of sophisticated perspectives on a given topic; receive detailed, constructive feedback on their logical reasoning, rhetorical devices, and persuasive language; rehearse complex presentations or legal arguments with GenAI; or use it to thoroughly explore the multifaceted aspects of a high-level academic or real-world problem. **GenAI can intentionally present a subtly flawed argument for the student to identify and articulate its weakness (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To enhance my critical thinking and argumentation']. **Action**: Engage me in an advanced debate. **Purpose**: To refine my arguments on [COMPLEX_ETHICAL_ISSUE, e.g., the ethics of AI autonomy] and **diagnose logical flaws**. **Expectation**: GenAI will challenge my statement: '[YOUR_ARGUMENT, e.g., AI should never make autonomous decisions]' by providing a nuanced counter-argument, highlighting potential logical fallacies or alternative interpretations. In one of its counter-arguments, GenAI will deliberately include a subtle logical flaw for me to identify and articulate its weakness, fostering deep critical analysis."
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
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my Pre-K to 3rd graders practice counting numbers']. **Action**: Generate simple drawing prompts. **Purpose**: To encourage creative practice for Pre-K to 3rd graders and **promote flexible application**. **Expectation**: Provide [NUMBER] prompts like 'Draw a [ANIMAL] with [NUMBER] eyes' or 'Draw your favorite [COLOR] monster'. For number matching, GenAI will vary the representation (e.g., dots, fingers, numerals) for each set to prevent rote memorization and encourage flexible understanding."
            },
            grade4_6: {
                text: "Create unlimited variations of math problems (addition, subtraction, multiplication, division); generate simple grammar exercises (e.g., identifying nouns and verbs); design scenarios for role-play practice (e.g., ordering food, asking for directions). **GenAI can interleave different types of math problems or grammar rules within a single practice set (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To give my 4th-6th graders more math practice']. **Action**: Create unlimited variations of math problems. **Purpose**: To provide practice for 4th-6th graders on [MATH_OPERATION, E.G._MULTIPLICATION] and **encourage interleaving**. **Expectation**: Generate [NUMBER] problems with solutions. Include a mix of single and multi-digit numbers. GenAI will interleave different types of math problems or grammar rules within a single practice set to encourage flexible thinking and deeper understanding."
            },
            grade7_10: {
                text: "Create unlimited variations of practice problems for math (algebra, geometry), grammar (sentence structure, punctuation), or coding exercises (simple functions, loops); generate realistic scenarios for role-play practice (e.g., customer service, negotiations, job interviews); design adaptive quizzes that adjust difficulty based on student performance; or produce examples of common errors and correct solutions for analysis. **GenAI can generate feedback that forces students to explain *why* their answer is wrong before providing the correct solution (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To prepare my 7th-10th graders for job interviews']. **Action**: Create realistic scenarios for role-play practice. **Purpose**: To help 7th-10th graders prepare for a [SITUATION_E.G._JOB_INTERVIEW] and **deepen self-correction**. **Expectation**: Provide [NUMBER] detailed scenarios, including the role of the interviewer, potential questions, and challenges. GenAI will then generate [NUMBER] common errors students might make and, when an error occurs, prompt them to explain *why* it's an error before revealing the correct solution, fostering self-correction."
            },
            grade11_12: {
                text: "Create an endless supply of complex practice problems for advanced math (calculus, statistics), intricate grammar and stylistic exercises (e.g., advanced essay structures, rhetorical analysis), or sophisticated coding challenges (e.g., algorithms, data structures); generate highly realistic and nuanced scenarios for role-play (e.g., complex business negotiations, medical diagnoses, legal arguments); design highly adaptive, personalized learning paths with intelligent quizzes that target individual weaknesses; or produce detailed examples of expert-level solutions and common pitfalls for deep learning and self-correction. **GenAI can provide immediate but minimal feedback, requiring students to elaborate on their thought process to receive more detailed guidance (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my 11th-12th graders master calculus concepts']. **Action**: Design a highly adaptive, personalized learning path. **Purpose**: To help 11th-12th graders master [COMPLEX_TOPIC_E.G._CALCULUS_INTEGRATION] and **promote self-explanation**. **Expectation**: The path should include [NUMBER] modules. For each module, generate [NUMBER] intelligent quiz questions. When a student answers incorrectly, GenAI will first ask them to explain their reasoning before providing any hints or the full solution, promoting deeper self-explanation and critical thinking."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can request endless practice problems in any subject (e.g., solving quadratic equations, conjugating verbs, writing basic code functions); get immediate, specific feedback on their attempts (e.g., identifying logical errors in code, suggesting grammatical corrections in an essay); practice speaking a new language with a conversational AI by engaging in simulated dialogues; rehearse presentations or speeches, receiving feedback on pacing and clarity; or refine their writing by asking for suggestions on tone, clarity, and conciseness for different audiences. **GenAI can introduce 'just right' challenges in language practice, requiring slightly more complex sentence structures or vocabulary than previously used (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To become more fluent in Spanish']. **Action**: Practice speaking [LANGUAGE_NAME, e.g., Spanish] with me. **Purpose**: To improve my conversational skills for a [SITUATION_E.G._TRAVELING_ABROAD, e.g., trip to Mexico] and **expand my linguistic repertoire**. **Expectation**: GenAI will engage me in a [NUMBER]-turn dialogue about [TOPIC, e.g., ordering food], providing feedback on my grammar and pronunciation. In a later turn, GenAI will prompt me to use a specific, slightly more complex grammar structure or vocabulary word to enhance my linguistic repertoire."
            },
            grade11_12: {
                text: "Students can request highly challenging and specialized practice problems (e.g., proofs in abstract algebra, advanced essay critiques, debugging complex software); receive detailed, analytical feedback on their performance, including alternative approaches and deeper conceptual explanations; engage in sophisticated language practice, including nuanced cultural expressions and formal discourse; rehearse critical professional presentations or interviews, receiving feedback on strategic communication; or use GenAI for deep refinement of academic papers, including argumentation, stylistic elegance, and adherence to specific disciplinary conventions. **GenAI can provide feedback that forces students to articulate the *underlying principle* behind a correction, rather data than just accepting the fix (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To write a compelling research paper']. **Action**: Critique my [TYPE_OF_PAPER_E.G._RESEARCH_ESSAY, e.g., research proposal]. **Purpose**: To refine my arguments and writing style for [ACADEMIC_COURSE, e.g., Senior English] and **deepen my understanding of writing principles**. **Expectation**: GenAI will analyze the logical flow of my arguments, identify rhetorical weaknesses, and suggest improvements for stylistic elegance and adherence to [SPECIFIC_DISCIPLINARY_CONVENTION, e.g., MLA format]. When suggesting a correction, GenAI will also ask me to explain the *underlying principle* behind the correction, ensuring deeper learning rather than just accepting a fix."
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
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To spark creativity in my Pre-K to 3rd graders']. **Action**: Generate ideas for simple art projects. **Purpose**: To spark creativity in Pre-K to 3rd graders for [THEME_E.G._SPRING] and **encourage divergent thinking**. **Expectation**: Provide [NUMBER] ideas that use common classroom materials. GenAI will include a prompt that asks students to combine two unrelated elements, like drawing a [ANIMAL] doing something unusual (e.g., '[ANIMAL] riding a bicycle'), to encourage imaginative thinking."
            },
            grade4_6: {
                text: "Generate initial templates or outlines for simple reports (e.g., book reports, science project outlines); provide example structures for different text types (e.g., persuasive letters, descriptive paragraphs); suggest creative project ideas (e.g., building a model, creating a comic book); or offer starter code snippets for very basic programming tasks (e.g., in Scratch). **GenAI can provide a scaffolded template that gradually reduces support across multiple tasks (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my 4th-6th graders write structured reports']. **Action**: Generate an outline for a report. **Purpose**: To help 4th-6th graders structure their [TYPE_OF_REPORT_E.G._BOOK_REPORT] and **build independent outlining skills**. **Expectation**: The outline should include [NUMBER] main sections. GenAI will provide example structures for different text types (e.g., persuasive letters) and for a subsequent report, provide a less detailed outline, requiring students to fill in more structure themselves, gradually building independence."
            },
            grade7_10: {
                text: "Generate initial templates or outlines for various assignments (essays, reports, presentations, creative writing pieces); provide example structures for different text types (e.g., argumentative essays, research papers, persuasive speeches); suggest creative project ideas based on learning objectives (e.g., designing a public awareness campaign, creating a short film script); or offer starter code snippets and debugging hints for programming tasks in various languages. **GenAI can provide feedback on a draft that requires students to justify *why* they made certain stylistic choices (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve essay writing and rhetorical awareness']. **Action**: Generate an outline for an argumentative essay. **Purpose**: To help 7th-10th graders structure their essay on [ESSAY_TOPIC] and **promote rhetorical awareness**. **Expectation**: The outline should include an introduction with a clear thesis, [NUMBER] body paragraphs, and a conclusion. GenAI will provide feedback on a draft that requires students to justify *why* they made certain stylistic choices, fostering deeper understanding of rhetorical impact."
            },
            grade11_12: {
                text: "Generate advanced templates or detailed outlines for complex academic assignments (e.g., thesis proposals, scientific lab reports, literary analyses, business plans); provide sophisticated example structures for highly specialized text types (e.g., grant proposals, legal briefs, technical specifications); suggest innovative and interdisciplinary project ideas (e.g., designing a sustainable urban model, developing a new scientific hypothesis); or offer advanced starter code, architectural patterns, and debugging support for complex software development projects. **GenAI can provide feedback that challenges students to reframe their argument for a different, potentially more skeptical, audience (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To develop strong thesis proposals and adapt arguments']. **Action**: Generate a detailed outline for a thesis proposal. **Purpose**: To assist 11th-12th graders in structuring their research on [THESIS_TOPIC] and **develop persuasive adaptation skills**. **Expectation**: The outline will include sections for abstract, literature review, methodology, expected outcomes, and bibliography. GenAI will provide feedback that challenges students to reframe their argument for a different, potentially more skeptical, audience, enhancing their persuasive writing skills."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can use GenAI for brainstorming ideas for projects or essays, generating outlines, getting help with structuring their arguments, receiving suggestions for improving their writing style, translating ideas into different formats (e.g., detailed notes to a presentation script), or generating initial drafts that they then refine. **GenAI can offer feedback that requires students to diagnose the *root cause* of a grammatical error, not just correct it (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve my essay structure and grammar']. **Action**: Generate an outline. **Purpose**: To help me structure my [TYPE_OF_ESSAY_E.G._ARGUMENTATIVE_ESSAY, e.g., argumentative essay] on [ESSAY_TOPIC, e.g., environmental conservation] and **master grammatical principles**. **Expectation**: GenAI will help me generate an outline and provide suggestions for improving my writing style. If I make a grammatical error, GenAI will point out the error and ask me to identify the *root cause* or rule I violated before giving the correct version, fostering deeper grammatical understanding."
            },
            grade11_12: {
                text: "Students can use GenAI for advanced brainstorming and ideation for complex research papers or capstone projects; generating detailed, multi-section outlines; receiving sophisticated guidance on argumentative structures, logical flow, and persuasive techniques; translating complex data or research findings into compelling narratives or presentation formats; or generating robust initial code structures, allowing them to focus on algorithm implementation and creative problem-solving. **GenAI can provide feedback that requires students to explain the *trade-offs* of different design choices in their production (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To write a high-quality academic paper']. **Action**: Provide sophisticated guidance on argumentative structures. **Purpose**: To refine the argumentative flow of my [TYPE_OF_PAPER_E.G._RESEARCH_PAPER, e.g., research paper] on [TOPIC, e.g., artificial intelligence ethics] and **evaluate design trade-offs**. **Expectation**: GenAI will analyze my current argumentative structure and suggest alternative structures, explaining their strengths and weaknesses. It will also provide feedback on my design choices, requiring me to explain the *trade-offs* of different approaches, enhancing my critical evaluation and problem-solving skills."
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
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To encourage my Pre-K to 3rd graders to share and cooperate']. **Action**: Suggest simple group activities. **Purpose**: To encourage teamwork among Pre-K to 3rd graders for [CLASS_ACTIVITY] and **promote adaptive grouping**. **Expectation**: Provide [NUMBER] ideas that involve sharing and simple decision-making. GenAI will suggest collaborative tasks that require students to physically move and re-group based on a changing criterion (e.g., initial grouping by [CRITERIA_1], then re-grouping by [CRITERIA_2]) to promote adaptive grouping and flexible collaboration."
            },
            grade4_6: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for simple group projects (e.g., a class play, a science presentation); suggest roles for group members (e.g., researcher, presenter, artist); create shared document templates for collaborative writing assignments (e.g., group story); or design simple problems that require students to combine their knowledge. **GenAI can intentionally introduce a minor conflicting requirement within a problem to necessitate negotiation (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To help my 4th-6th graders work together effectively']. **Action**: Facilitate brainstorming session ideas. **Purpose**: To help 4th-6th graders kickstart a group project on [PROJECT_TOPIC] and **encourage negotiation**. **Expectation**: Generate [NUMBER] diverse project ideas. GenAI will intentionally introduce a minor conflicting requirement within a problem to necessitate negotiation and compromise among students, enhancing their collaborative skills."
            },
            grade7_10: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for group projects; suggest roles and responsibilities for group members; create shared document templates for collaborative writing or project planning; or design complex problems that genuinely require multiple perspectives and shared understanding to solve effectively. **GenAI can simulate a group member who subtly shifts their position, requiring active listening and adaptive responses (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To improve group problem-solving for my 7th-10th graders']. **Action**: Design a complex problem for collaborative solving. **Purpose**: To challenge 7th-10th graders to work together on [SUBJECT_AREA_E.G._ENVIRONMENTAL_SCIENCE] and **develop dynamic collaboration skills**. **Expectation**: Create a problem scenario that requires combining knowledge from multiple disciplines. GenAI will simulate a group member who subtly shifts their position, requiring students to practice active listening and adaptive responses, enhancing their dynamic collaboration skills."
            },
            grade11_12: {
                text: "Facilitate advanced brainstorming sessions for highly complex, interdisciplinary group projects; dynamically suggest specialized roles based on team strengths and project needs; create sophisticated collaborative workspace templates (e.g., integrated planning, research, and drafting modules); or design wicked problems and grand challenges that demand authentic collaboration, negotiation, and synthesis of diverse expertise. **GenAI can introduce an unexpected external constraint or resource change during a project, forcing the group to pivot their strategy (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To engage my 11th-12th graders in complex, real-world challenges']. **Action**: Design a wicked problem for authentic collaboration. **Purpose**: To engage 11th-12th graders in a grand challenge related to [GLOBAL_ISSUE] and **foster strategic adaptation**. **Expectation**: Create a multi-faceted problem requiring interdisciplinary expertise. GenAI will introduce an unexpected external constraint or resource change during the project, forcing the group to pivot their strategy and adapt to new conditions, fostering strategic adaptation."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning."
            },
            grade7_10: {
                text: "Students can use GenAI as a shared brainstorming tool for generating initial ideas for group projects; a resource for collective problem-solving (e.g., 'How can our team best approach this challenge, considering X, Y, and Z factors?'); a neutral party to synthesize different group members' ideas into a coherent summary; or to simulate scenarios where team decisions and negotiations are required. **GenAI can present two equally plausible but mutually exclusive solutions and ask the group to justify their chosen compromise (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To brainstorm ideas for our group project on renewable energy']. **Action**: Act as a shared brainstorming tool. **Purpose**: To help our team generate ideas for our [GROUP_PROJECT_TYPE_E.G._MODEL_VOLCANO, e.g., renewable energy project] and **develop critical evaluation of ideas**. **Expectation**: GenAI will ask us questions to get our ideas, then summarize our suggestions. After brainstorming, GenAI will ask us to identify the *single strongest* idea generated and explain our reasoning, fostering critical evaluation of collective thinking."
            },
            grade11_12: {
                text: "Students can use GenAI as a sophisticated collaborative brainstorming partner, generating divergent and convergent ideas for complex team challenges; a comprehensive resource for advanced collective problem-solving (e.g., 'Given these constraints, how can our team optimize this engineering solution?'); a neutral facilitator to synthesize highly complex, disparate group contributions into actionable plans or comprehensive reports; or to simulate intricate scenarios requiring strategic team decision-making, negotiation, and conflict resolution. **GenAI can simulate a 'devil's advocate' role, intentionally poking holes in the group's proposed solution to force deeper justification and refinement (desirable difficulty).**",
                prompt: "**My Learning Goal is**: [Clearly state your learning objective, e.g., 'To develop innovative solutions for global issues']. **Action**: Act as a sophisticated collaborative brainstorming partner. **Purpose**: To help our team generate divergent and convergent ideas for our [COMPLEX_TEAM_CHALLENGE, e.g., designing a sustainable city] and **strengthen solution robustness**. **Expectation**: GenAI will ask guiding questions and help us narrow down to actionable solutions. After we propose a solution, GenAI will simulate a 'devil's advocate' role, presenting strong counter-arguments or unforeseen problems, requiring us to refine and justify our solution further, strengthening collective reasoning."
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
                            ? 'bg-violet-300 text-violet-900 shadow-md' // Changed for better readability
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
        window.scrollTo(0, 0); // Scroll to top when card changes
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
                className="back-button mb-6 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold transform hover:scale-105
                bg-pink-600 hover:bg-pink-700 inline-flex items-center" // Made more prominent
            >
                <Home className="w-5 h-5 mr-2" /> {/* Added home icon */}
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
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full shadow-sm mt-2 min-w-[120px]"
                                style={{ backgroundColor: 'white', color: 'black', fontSize: '18px', fontWeight: 'bold' }}
                            >
                                <Lightbulb className="w-5 h-5 mr-1" style={{ color: 'black' }} />
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
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full shadow-sm mt-2 min-w-[120px]"
                                style={{ backgroundColor: 'white', color: 'black', fontSize: '18px', fontWeight: 'bold' }}
                            >
                                <Lightbulb className="w-5 h-5 mr-1" style={{ color: 'black' }} />
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

    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

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
