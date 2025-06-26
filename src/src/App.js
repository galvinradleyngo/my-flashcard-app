import React, { useState, useEffect } from 'react';
// Importing icons from Lucide React
import { Book, MessageSquare, Users, Lightbulb, Home } from 'lucide-react'; // Removed unused icons: Search, Repeat, PenTool

// Data for the flashcards, now with grade-differentiated examples and sample prompts
const flashcardData = [
    {
        activityType: "1. Acquisition",
        description: "Learners listen, read, or watch to grasp concepts. This involves receiving information.",
        simpleExample: "Example: Reading a chapter, watching a documentary.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Generate simple stories with repetitive elements for early readers; create printable coloring pages that introduce new vocabulary; produce short, engaging audio clips for listening comprehension, **with varied voices to aid auditory processing (desirable difficulty)**.",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating simple stories with repetitive elements for early readers.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your specific learning objective for this story (e.g., 'To help my Pre-K to 3rd graders recognize sight words')?\n2. What new vocabulary word(s) should the story focus on?\n3. What is the topic of the story?\n4. What type of character(s) should be featured?\n5. How many sentences long should the story be?\n6. How many simple retrieval questions should be included about the story's events? (The repetitive phrase will be highlighted automatically.)\n\n**Tip for using this output in class**: After GenAI generates the story, print it out for a reading station, or display it on a projector. Use the generated questions for a quick check-for-understanding verbally or with hand signals. Discuss the repetitive phrase and new vocabulary as a class."
            },
            grade4_6: {
                text: "Generate summaries of historical events or science topics at a 4-6 grade reading level; design interactive quizzes with picture-based answers; develop scripts for short educational puppet shows. **Intersperse quizzes within longer summaries to encourage active processing (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through summarizing concepts or events for 4th-6th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To help my 4th-6th graders understand the basics of a concept')?\n2. What concept or event should the summary focus on?\n3. What are the key points that should be covered?\n4. Approximately how many paragraphs should the summary be?\n5. How many multiple-choice quiz questions with image suggestions should be included, and how often should they appear within the summary (e.g., every 2 paragraphs)?\n\n**Tip for using this output in class**: Distribute the generated summary and quiz questions as a reading assignment. Encourage students to highlight key information and answer the questions as they read. Follow up with a class discussion to review answers and clarify any misconceptions, possibly using the image suggestions for visual aids."
            },
            grade7_10: {
                text: "Generate concise summaries of complex literary texts or scientific articles; create differentiated reading passages at various levels of complexity for a given topic; design interactive quizzes with automated feedback focusing on factual recall and comprehension. **Vary the format of generated summaries (e.g., bullet points, narrative, concept map outlines) to encourage flexible thinking (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating concise summaries and differentiated explanations for 7th-10th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To enhance my 7th-10th graders' ability to synthesize information from various sources')?\n2. What article, text, or topic should the summary be based on?\n3. What is the main argument or key findings that should be highlighted?\n4. How many words should the summary be (maximum)?\n5. How many different versions of the summary would you like (e.g., bulleted, narrative, concept map outline)?\n6. How many differentiated reading passages should be provided from this summary, and at what reading complexity levels (e.e.g., beginner, intermediate, advanced)?\n\n**Tip for using this output in class**: Use the differentiated explanations to support varied learning needs. Assign different summary formats (bulleted, narrative, concept map outline) to small groups, then have them compare and discuss the effectiveness of each format for understanding the material. The automated feedback quizzes can be used for individual assessment."
            },
            grade11_12: {
                text: "Generate detailed synopses of academic papers or dense historical documents; create sophisticated reading passages with advanced vocabulary for specific subjects; develop video scripts for in-depth instructional content (e.g., advanced physics concepts, economic theories); produce realistic, multi-faceted case studies for high-level analysis. **Introduce subtle inconsistencies or missing information in case studies to prompt deeper investigation and critical evaluation (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through developing instructional materials including video scripts and multi-faceted case studies for 11th-12th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To foster critical evaluation skills in my 11th-12th graders')?\n2. What complex concept or topic should the script focus on?\n3. Approximately how long should the video script be (in minutes)?\n4. What sub-topics should be included in the explanation?\n5. How many subtle ambiguities or gaps should be introduced into the related case study to prompt deeper investigation?\n\n**Tip for using this output in class**: Assign the video script for students to produce as a project, encouraging them to research and visualize the concepts. Use the multi-faceted case study as a basis for a Socratic seminar or a group problem-solving activity, where students must identify and address the inconsistencies to arrive at a well-supported conclusion."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can ask GenAI to explain concepts in simpler terms or from different angles; summarize long articles or chapters; generate practice questions on a topic with hints; create flashcards for vocabulary or key facts; or produce alternative explanations for difficult mathematical or scientific material. **GenAI can present concepts from a slightly different perspective after the initial explanation to encourage deeper processing (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI tutor. Your goal is to guide me step-by-step to help me understand a concept and prepare for a test by generating practice questions.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What subject and topic is your test on (e.g., historical events, chemical reactions, literary analysis)?\n3. How many multiple-choice questions would you like?\n4. Are there any specific areas of this topic you want to focus on (e.g., key figures, specific theories)?\n(GenAI will provide hints and feedback on your thinking, and if incorrect, an alternative explanation.)"
            },
            grade11_12: {
                text: "Students can ask GenAI for deeper explanations of abstract concepts; request detailed summaries of research papers or complex theories; generate advanced practice problems (e.e.g., calculus, organic chemistry) with step-by-step solutions; create comprehensive digital flashcards with complex definitions and examples; or use it to explore different theoretical frameworks for a given topic. **GenAI can provide related but distinct problems (interleaved practice) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI tutor. Your goal is to guide me step-by-step to help me deeply understand an abstract concept.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If my answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What abstract concept or theory would you like me to explain (e.g., quantum entanglement, philosophical ethics)?\n3. From what perspectives should I explain it (e.g., a theoretical perspective, a practical applications view)?\n4. What fields or implications should I discuss (e.g., social impact, scientific breakthroughs, historical context)?\n5. What related concepts should I include for interleaved practice (e.g., foundational theories, contrasting viewpoints)?\n"
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers define learning goals (Human), GenAI generates varied resources (AI), and students critically evaluate, select, and discuss content (Human)." ,
        icon: <Book className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "2. Investigation",
        description: "Learners explore, question, and research, often to solve problems or understand phenomena. This involves active inquiry.",
        simpleExample: "Example: Conducting a science experiment, solving a historical mystery.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Create simple 'mystery boxes' with clues for students to guess an object; generate 'what if' scenarios about animal habitats; design scavenger hunts for colors or shapes around the classroom. **GenAI can generate 'mystery' elements that require simple inference rather than direct fact recall (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating 'what if' scenarios for early learners to encourage critical thinking.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If my answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To encourage my Pre-K to 3rd graders to ask thoughtful questions')?\n2. What environment or context should the scenarios focus on (e.g., a bustling city park, a fantasy land, animal habitats)?\n3. How many simple scenarios would you like?\n4. For each scenario, what character/object and unusual situation should be featured (e.g., 'What if a toy car could fly to the moon?', 'What if a tiny seed grew into a giant tree?')?\n\n**Tip for using this output in class**: Use the 'what if' scenarios as prompts for group discussions or drawing activities. Encourage students to make predictions and explain their reasoning, fostering early critical thinking and imaginative play."
            },
            grade4_6: {
                text: "Generate open-ended research prompts about local ecosystems or historical figures; create simplified hypothetical scenarios or datasets about weather patterns or animal migration for students to analyze; design simple 'detective' games requiring students to gather information. **GenAI can provide slightly ambiguous initial information in scenarios, requiring students to ask clarifying questions (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating open-ended research prompts for 4th-6th graders to develop research skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If my answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To develop research skills in my 4th-6th graders')?\n2. What topic or area should the prompts focus on (e.g., local community issues, historical figures, scientific phenomena)?\n3. How many research prompts would you like?\n(GenAI will include slightly ambiguous initial information in scenarios to encourage clarifying questions.)\n\n**Tip for using this output in class**: Assign these prompts for independent or small-group research projects. Guide students to identify reliable sources and synthesize information. The ambiguous scenarios can be used to initiate a class discussion on critical thinking and questioning skills."
            },
            grade7_10: {
                text: "Curate diverse digital resources (articles, basic datasets, simple simulations) tailored to a specific inquiry question (e.g., 'What factors influence climate?'); generate open-ended research prompts requiring data collection and analysis; create hypothetical scenarios or datasets for students to analyze (e.g., analyzing population trends, scientific experiment results); or design escape rooms/puzzles that require investigation and problem-solving to solve. **GenAI can present slightly contradictory 'expert' opinions in a scenario to encourage source evaluation (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating hypothetical scenarios for 7th-10th graders to improve data analysis and evaluation.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To improve data analysis and evaluation in my 7th-10th graders')?\n2. What topic area should the scenarios focus on (e.g., social trends, scientific findings, historical data)?\n3. How many detailed scenarios would you like, each with a small dataset or set of variables?\n(GenAI will include questions that require students to analyze trends and present slightly contradictory 'expert' opinions to encourage critical source evaluation.)\n\n**Tip for using this output in class**: Use the hypothetical scenarios and datasets for group analysis activities. Encourage students to work collaboratively to interpret data, identify biases, and formulate conclusions. The contradictory opinions can be a starting point for a debate on source credibility and evidence-based reasoning."
            },
            grade11_12: {
                text: "Curate extensive and diverse resources (peer-reviewed articles, complex datasets, advanced simulations) for in-depth inquiry (e.g., 'Analyzing the socio-economic impacts of climate change'); generate complex, multi-faceted research prompts requiring critical evaluation of sources; create intricate hypothetical scenarios or large-scale datasets for students to rigorously analyze and draw conclusions; or design elaborate digital 'cold case' simulations requiring advanced investigative techniques. **GenAI can introduce irrelevant or distracting information into resource sets to train information filtering (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through designing an elaborate digital 'cold case' simulation for 11th-12th graders to enhance investigative and information filtering skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To enhance advanced investigative and information filtering skills')?\n2. What historical event, scientific mystery, or complex problem should the simulation focus on (e.g., a Cold War espionage case, an unexplained natural phenomenon)?\n3. How many key 'clues' (e.g., documents, data snippets) should the narrative include?\n4. How many pieces of irrelevant or distracting information should be introduced to train information filtering?\n\n**Tip for using this output in class**: Implement the 'cold case' simulation as a multi-day project. Divide students into investigative teams, assigning them roles to gather, analyze, and synthesize information. The intentionally distracting information will help them develop crucial information filtering skills, mimicking real-world investigative challenges."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can ask GenAI to explain concepts in simpler terms or from different angles; summarize long articles or chapters; generate practice questions on a topic with hints; create flashcards for vocabulary or key facts; or produce alternative explanations for difficult mathematical or scientific material. **GenAI can present concepts from a slightly different perspective after the initial explanation to encourage deeper processing (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI tutor. Your goal is to guide me step-by-step to help me understand a concept and prepare for a test by generating practice questions.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What subject and topic is your test on (e.g., historical events, chemical reactions, literary analysis)?\n3. How many multiple-choice questions would you like?\n4. Are there any specific areas of this topic you want to focus on (e.g., key figures, specific theories)?\n(GenAI will provide hints and feedback on your thinking, and if incorrect, an alternative explanation.)"
            },
            grade11_12: {
                text: "Students can ask GenAI for deeper explanations of abstract concepts; request detailed summaries of research papers or complex theories; generate advanced practice problems (e.e.g., calculus, organic chemistry) with step-by-step solutions; create comprehensive digital flashcards with complex definitions and examples; or use it to explore different theoretical frameworks for a given topic. **GenAI can provide related but distinct problems (interleaved practice) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI tutor. Your goal is to guide me step-by-step to help me deeply understand an abstract concept.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What abstract concept or theory would you like me to explain (e.g., quantum entanglement, philosophical ethics)?\n3. From what perspectives should I explain it (e.g., a theoretical perspective, a practical applications view)?\n4. What fields or implications should I discuss (e.g., social impact, scientific breakthroughs, historical context)?\n5. What related concepts should I include for interleaved practice (e.g., foundational theories, contrasting viewpoints)?\n"
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers define learning goals (Human), GenAI generates varied resources (AI), and students critically evaluate, select, and discuss content (Human)." ,
        icon: <Book className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "2. Investigation",
        description: "Learners explore, question, and research, often to solve problems or understand phenomena. This involves active inquiry.",
        simpleExample: "Example: Conducting a science experiment, solving a historical mystery.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Create simple 'mystery boxes' with clues for students to guess an object; generate 'what if' scenarios about animal habitats; design scavenger hunts for colors or shapes around the classroom. **GenAI can generate 'mystery' elements that require simple inference rather than direct fact recall (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating 'what if' scenarios for early learners to encourage critical thinking.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To encourage my Pre-K to 3rd graders to ask thoughtful questions')?\n2. What environment or context should the scenarios focus on (e.g., a bustling city park, a fantasy land, animal habitats)?\n3. How many simple scenarios would you like?\n4. For each scenario, what character/object and unusual situation should be featured (e.g., 'What if a toy car could fly to the moon?', 'What if a tiny seed grew into a giant tree?')?\n\n**Tip for using this output in class**: Use the 'what if' scenarios as prompts for group discussions or drawing activities. Encourage students to make predictions and explain their reasoning, fostering early critical thinking and imaginative play."
            },
            grade4_6: {
                text: "Generate open-ended research prompts about local ecosystems or historical figures; create simplified hypothetical scenarios or datasets about weather patterns or animal migration for students to analyze; design simple 'detective' games requiring students to gather information. **GenAI can provide slightly ambiguous initial information in scenarios, requiring students to ask clarifying questions (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating open-ended research prompts for 4th-6th graders to develop research skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To develop research skills in my 4th-6th graders')?\n2. What topic or area should the prompts focus on (e.g., local community issues, historical figures, scientific phenomena)?\n3. How many research prompts would you like?\n(GenAI will include slightly ambiguous initial information in scenarios to encourage clarifying questions.)\n\n**Tip for using this output in class**: Assign these prompts for independent or small-group research projects. Guide students to identify reliable sources and synthesize information. The ambiguous scenarios can be used to initiate a class discussion on critical thinking and questioning skills."
            },
            grade7_10: {
                text: "Curate diverse digital resources (articles, basic datasets, simple simulations) tailored to a specific inquiry question (e.g., 'What factors influence climate?'); generate open-ended research prompts requiring data collection and analysis; create hypothetical scenarios or datasets for students to analyze (e.g., analyzing population trends, scientific experiment results); or design escape rooms/puzzles that require investigation and problem-solving to solve. **GenAI can present slightly contradictory 'expert' opinions in a scenario to encourage source evaluation (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating hypothetical scenarios for 7th-10th graders to improve data analysis and evaluation.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To improve data analysis and evaluation in my 7th-10th graders')?\n2. What topic area should the scenarios focus on (e.g., social trends, scientific findings, historical data)?\n3. How many detailed scenarios would you like, each with a small dataset or set of variables?\n(GenAI will include questions that require students to analyze trends and present slightly contradictory 'expert' opinions to encourage critical source evaluation.)\n\n**Tip for using this output in class**: Use the hypothetical scenarios and datasets for group analysis activities. Encourage students to work collaboratively to interpret data, identify biases, and formulate conclusions. The contradictory opinions can be a starting point for a debate on source credibility and evidence-based reasoning."
            },
            grade11_12: {
                text: "Curate extensive and diverse resources (peer-reviewed articles, complex datasets, advanced simulations) for in-depth inquiry (e.g., 'Analyzing the socio-economic impacts of climate change'); generate complex, multi-faceted research prompts requiring critical evaluation of sources; create intricate hypothetical scenarios or large-scale datasets for students to rigorously analyze and draw conclusions; or design elaborate digital 'cold case' simulations requiring advanced investigative techniques. **GenAI can introduce irrelevant or distracting information into resource sets to train information filtering (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through designing an elaborate digital 'cold case' simulation for 11th-12th graders to enhance investigative and information filtering skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To enhance advanced investigative and information filtering skills')?\n2. What historical event, scientific mystery, or complex problem should the simulation focus on (e.g., a Cold War espionage case, an unexplained natural phenomenon)?\n3. How many key 'clues' (e.g., documents, data snippets) should the narrative include?\n4. How many pieces of irrelevant or distracting information should be introduced to train information filtering?\n\n**Tip for using this output in class**: Implement the 'cold case' simulation as a multi-day project. Divide students into investigative teams, assigning them roles to gather, analyze, and synthesize information. The intentionally distracting information will help them develop crucial information filtering skills, mimicking real-world investigative challenges."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can ask GenAI to explain concepts in simpler terms or from different angles; summarize long articles or chapters; generate practice questions on a topic with hints; create flashcards for vocabulary or key facts; or produce alternative explanations for difficult mathematical or scientific material. **GenAI can present concepts from a slightly different perspective after the initial explanation to encourage deeper processing (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI inquiry guide. Your goal is to help me investigate a topic by suggesting different perspectives and questions.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your inquiry goal?\n2. What subject or topic do you want to investigate (e.g., the impact of technology on society, the causes of historical events)?\n3. What kind of questions would you like to explore (e.g., 'why' questions, 'how' questions, comparative questions)?\n4. Are there any specific aspects of this topic you want to focus on?\n(GenAI will suggest different angles of investigation and provide resources to explore.)"
            },
            grade11_12: {
                text: "Students can ask GenAI for deeper explanations of abstract concepts; request detailed summaries of research papers or complex theories; generate advanced practice problems (e.g., calculus, organic chemistry) with step-by-step solutions; create comprehensive digital flashcards with complex definitions and examples; or use it to explore different theoretical frameworks for a given topic. **GenAI can provide related but distinct problems (interleaved practice) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI research assistant. Your goal is to help me conduct in-depth research by identifying key questions and potential pitfalls.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your research objective?\n2. What complex research topic are you exploring (e.g., the ethics of gene editing, the socio-economic impacts of globalization)?\n3. What specific research questions are you trying to answer?\n4. What potential challenges or biases should you be aware of in your research?\n5. What additional resources or perspectives would you like to consider?\n(GenAI will help you identify potential biases and guide you to diverse sources for a comprehensive investigation.)"
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers define learning goals (Human), GenAI generates varied resources (AI), and students critically evaluate, select, and discuss content (Human)." ,
        icon: <Book className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "3. Discussion",
        description: "Learners articulate their understanding, challenge ideas, and engage in dialogue with peers or the teacher. This fosters collaborative meaning-making.",
        simpleExample: "Example: Debating a current event, discussing a book's theme.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Generate simple prompts for 'show and tell'; create scenarios for sharing toys; suggest sentence starters for polite disagreements ('I hear you, but I think...'). **GenAI can generate prompts that require students to listen to a peer's idea and then add a related, but different, thought (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating simple prompts for 'show and tell' to foster polite classroom discussions.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To foster polite classroom discussions')?\n2. How many prompts would you like?\n3. What is the main theme or focus of the discussion (e.g., showing a favorite object, sharing a recent experience, discussing a class rule)?\n(GenAI will include follow-up instructions to encourage active listening and response.)\n\n**Tip for using this output in class**: Use these prompts as a structured way to encourage verbal participation. You can have students draw or bring an item related to the prompt, and then use the GenAI-generated follow-up questions to facilitate a class discussion, encouraging peer interaction and active listening."
            },
            grade4_6: {
                text: "Generate discussion prompts for classroom debates on topics like 'Should we have school uniforms?'; create simple character personas for role-playing a historical event; simulate a friendly argument about a book's ending. **GenAI can provide slightly incomplete arguments for personas, requiring students to fill in the gaps with their own reasoning (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating discussion prompts and character personas for classroom debates.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To develop respectful debate skills in my 4th-6th graders')?\n2. What is the discussion or debate topic (e.g., a class decision, a historical event, a book theme)?\n3. How many prompts covering both sides of the argument would you like?\n4. How many simple character personas should be created for role-playing, each with a slightly incomplete argument for students to complete?\n\n**Tip for using this output in class**: Divide the class into groups and assign each group a persona. Encourage them to research and complete the arguments. Facilitate a structured debate, guiding students to use respectful language and evidence-based reasoning. This helps practice argumentation and perspective-taking."
            },
            grade7_10: {
                text: "Generate thought-provoking discussion prompts for debates or small group work on controversial topics (e.g., ethical dilemmas in science, historical interpretations); create detailed personas for role-playing discussions (e.g., historical figures, different scientific viewpoints, characters from literature); simulate a short, guided conversation on a specific topic for students to analyze; or provide balanced counter-arguments for students to critically evaluate and refute. **GenAI can simulate a peer's argument that contains a common misconception, prompting students to identify and correct it (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating detailed personas for role-playing discussions to improve critical reasoning.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To improve critical reasoning and discussion in my 7th-10th graders')?\n2. What topic or scenario should the discussion focus on (e.g., a current event, a scientific dilemma, a literary analysis)?\n3. How many personas with distinct viewpoints would you like?\n(GenAI will include a common misconception in one persona's talking points for students to identify and correct.)\n\n**Tip for using this output in class**: Assign roles to students using the generated personas for a classroom debate or Socratic seminar. Encourage them to prepare by researching their assigned viewpoint and anticipating counter-arguments. The misconception within a persona provides a valuable learning opportunity for students to practice identifying and respectfully correcting flawed reasoning."
            },
            grade11_12: {
                text: "Generate complex discussion prompts requiring nuanced argumentation for Socratic seminars or advanced debates (e.g., philosophical concepts, policy implications); create intricate personas with specific motivations and backstories for in-depth role-playing (e.g., UN delegates, legal teams); simulate extended, multi-turn discussions on highly controversial or abstract topics for students to dissect; or provide sophisticated, well-reasoned counter-arguments to push students' critical thinking and rebuttal skills. **GenAI can introduce unexpected data or ethical dilemmas during a simulated discussion to force real-time adaptation of arguments (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating complex discussion prompts for Socratic seminars to promote adaptive argumentation.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To prepare my 11th-12th graders for advanced academic discussions')?\n2. What complex concept or issue should the discussion focus on (e.g., a philosophical dilemma, a policy debate, a literary interpretation)?\n3. How many open-ended questions encouraging nuanced argumentation and critical thinking would you like?\n(GenAI will introduce new data or ethical dilemmas during a simulated discussion to challenge adaptation.)\n\n**Tip for using this output in class**: Use these prompts to facilitate a deep, philosophical discussion. Challenge students to connect concepts to real-world issues. The introduction of new data or ethical dilemmas mid-discussion can simulate real-world complexities, requiring students to adapt their arguments and think on their feet."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can engage GenAI as a debate partner on a specific topic, receiving basic counter-arguments; ask for multiple perspectives on a social issue or historical event; receive instant feedback on the clarity and coherence of their arguments; practice articulating their thoughts and structuring responses before a real discussion; or use it to explore different sides of a complex issue by generating pro/con lists. **GenAI can provide feedback that points out logical gaps or asks for more evidence (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI debate partner. Your goal is to guide me step-by-step to help me improve my debate arguments and logical coherence.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What is the discussion or debate topic (e.g., a current social issue, a historical interpretation, a scientific controversy)?\n3. What is your initial point or argument?\n4. Would you like me to provide different perspectives on this topic (e.g., economic, ethical, historical)?\n(GenAI will present counter-arguments and provide feedback on logical gaps.)"
            },
            grade11_12: {
                text: "Students can engage GenAI in advanced debates on complex academic or ethical issues, requesting nuanced counter-arguments and challenging its logic; ask for a wide range of sophisticated perspectives on a given topic; receive detailed, constructive feedback on their logical reasoning, rhetorical devices, and persuasive language; rehearse critical professional presentations or legal arguments with GenAI; or use it to thoroughly explore the multifaceted aspects of a high-level academic or real-world problem. **GenAI can intentionally present a subtly flawed argument for the student to identify and articulate its weakness (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI debate partner. Your goal is to guide me step-by-step to help me enhance my critical thinking and argumentation skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What complex issue do you want to discuss or debate (e.g., a contemporary ethical dilemma, a historical turning point, a scientific policy)?\n3. What is your initial statement or argument on this topic?\n(GenAI will challenge your statement with nuanced counter-arguments and intentionally flawed arguments for you to identify.)"
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers set discussion norms (Human), GenAI provides initial prompts or different viewpoints (AI), and students engage in meaningful peer-to-peer dialogue (Human)." ,
        icon: <MessageSquare className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "4. Practice",
        description: "Learners perform tasks repeatedly to develop skills and consolidate knowledge, often receiving feedback.",
        simpleExample: "Example: Solving math problems, conjugating verbs, writing code.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Create endless variations of number matching games; generate simple drawing prompts; produce alphabet tracing worksheets. **GenAI can introduce slightly varied examples in a drill set (e.g., different fonts, object types) to prevent rote memorization (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through generating simple drawing prompts and varied practice exercises for early learners.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To help my Pre-K to 3rd graders practice foundational skills')?\n2. What type of practice prompts or exercises would you like (e.g., drawing prompts, matching games, tracing exercises)?\n3. If specific content is needed, what theme or elements should be featured (e.g., farm animals, shapes, numbers)?\n(GenAI will vary the representation for practice exercises to promote flexible application.)\n\n**Tip for using this output in class**: Print the drawing prompts for a creative center activity. Use the varied practice exercises as a quick, individual assessment tool or for small group practice. Observe students' responses to identify areas where further support is needed."
            },
            grade4_6: {
                text: "Create unlimited variations of math problems (addition, subtraction, multiplication, division); generate simple grammar exercises (e.e.g., identifying nouns and verbs); design scenarios for role-play practice (e.g., ordering food, asking for directions). **GenAI can interleave different types of math problems or grammar rules within a single practice set (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through creating varied practice problems and role-play scenarios for 4th-6th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. You will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To give my 4th-6th graders more practice with a specific skill')?\n2. What subject or skill should the practice problems focus on (e.g., grammar rules, historical dates, scientific classifications)?\n3. How many problems with solutions would you like?\n4. Would you like a short role-play scenario for a specific situation (e.g., ordering food)?\n(GenAI will interleave different problem types or skill applications to encourage flexible thinking.)\n\n**Tip for using this output in class**: Use the generated practice problems for differentiated practice in class or as homework. The role-play scenarios can be integrated into drama or language arts lessons to practice real-world communication skills. Encourage peer feedback during role-play."
            },
            grade7_10: {
                text: "Create unlimited variations of practice problems for math (algebra, geometry), grammar (sentence structure, punctuation), or coding exercises (simple functions, loops); generate realistic scenarios for role-play practice (e.g., customer service, negotiations, job interviews); design adaptive quizzes that adjust difficulty based on student performance; or produce examples of common errors and correct solutions for analysis. **GenAI can generate feedback that forces students to explain *why* their answer is wrong before providing the correct solution (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through creating realistic scenarios and error analysis exercises for 7th-10th graders to improve their practical skills.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To prepare my 7th-10th graders for real-world applications')?\n2. What type of situation should the role-play focus on (e.g., a historical negotiation, a scientific presentation, a persuasive speech)?\n3. How many detailed scenarios, including potential questions and challenges, would you like?\n4. How many common errors should GenAI generate for students to identify and explain?\n\n**Tip for using this output in class**: Use these scenarios for mock interviews or customer service simulations. Provide students with the common errors and have them analyze and discuss why they are errors before revealing the corrections. This promotes metacognition and deeper understanding of the underlying principles."
            },
            grade11_12: {
                text: "Create an endless supply of complex practice problems for advanced math (calculus, statistics), intricate grammar and stylistic exercises (e.g., advanced essay structures, rhetorical analysis), or sophisticated coding challenges (e.g., algorithms, data structures); generate highly realistic and nuanced scenarios for role-play (e.g., complex business negotiations, medical diagnoses, legal arguments); design highly adaptive, personalized learning paths with intelligent quizzes that target individual weaknesses; or produce detailed examples of expert-level solutions and common pitfalls for deep learning and self-correction. **GenAI can provide immediate but minimal feedback, requiring students to elaborate on their thought process to receive more detailed guidance (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through designing a highly adaptive, personalized learning path with intelligent quizzes for 11th-12th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To help my 11th-12th graders master advanced concepts')?\n2. What complex topic or skill should the learning path focus on (e.g., advanced physics, literary criticism, economic models)?\n3. How many modules should the path include?\n4. How many intelligent quiz questions should be generated per module?\n(When you answer incorrectly, GenAI will first ask you to explain your reasoning before providing hints.)\n\n**Tip for using this output in class**: Assign these personalized learning paths for independent study, allowing students to progress at their own pace. Encourage them to use the GenAI's prompt for self-explanation to deepen their understanding, and use class time for targeted intervention or advanced problem-solving sessions based on their progress."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can engage GenAI as a debate partner on a specific topic, receiving basic counter-arguments; ask for multiple perspectives on a social issue or historical event; receive instant feedback on the clarity and coherence of their arguments; practice articulating their thoughts and structuring responses before a real discussion; or use it to explore different sides of a complex issue by generating pro/con lists. **GenAI can provide feedback that points out logical gaps or asks for more evidence (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI practice coach. Your goal is to help me practice a skill or concept and get feedback.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What skill or concept do you want to practice?\n2. What type of practice problems or exercises would you like (e.g., multiple-choice questions, fill-in-the-blanks, coding challenges)?\n3. How many problems or exercises would you like?\n4. Should the practice focus on any specific sub-topics or types of challenges?\n(GenAI will provide immediate feedback and suggest areas for improvement.)"
            },
            grade11_12: {
                text: "Students can engage GenAI in advanced debates on complex academic or ethical issues, requesting nuanced counter-arguments and challenging its logic; ask for a wide range of sophisticated perspectives on a given topic; receive detailed, constructive feedback on their logical reasoning, rhetorical devices, and persuasive language; rehearse critical professional presentations or legal arguments with GenAI; or use it to thoroughly explore the multifaceted aspects of a high-level academic or real-world problem. **GenAI can intentionally present a subtly flawed argument for the student to identify and articulate its weakness (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI advanced practice tutor. Your goal is to provide challenging practice and nuanced feedback to deepen my mastery.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What advanced skill or concept do you want to master?\n2. What type of complex practice problem or scenario would you like (e.g., a nuanced case study, an advanced coding challenge, a complex data analysis task)?\n3. What specific areas or sub-skills should these problems target?\n(GenAI will offer targeted feedback and suggest variations to ensure deep understanding and transfer.)"
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers set discussion norms (Human), GenAI provides initial prompts or different viewpoints (AI), and students engage in meaningful peer-to-peer dialogue (Human)." ,
        icon: <MessageSquare className="text-violet-500 mb-3" size={48} />
    },
    {
        activityType: "6. Collaboration",
        description: "Learners work together to achieve a shared goal, often involving co-creation and negotiation.",
        simpleExample: "Example: Group project, team presentation, peer review.", // New simple example
        teacherActivities: {
            preK3: {
                text: "Suggest simple group activities; generate ideas for sharing toys; create songs about teamwork. **GenAI can suggest collaborative tasks that require students to physically move and re-group based on a changing criteria (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through suggesting simple group activities to encourage sharing and cooperation among early learners.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To encourage my Pre-K to 3rd graders to share and cooperate')?\n2. What kind of class activity should the group activities be for?\n3. How many ideas for activities would you like, focusing on sharing and simple decision-making?\n4. What criteria should GenAI use for initially grouping students, and what different criteria for re-grouping (e.g., favorite color then shoe color)?\n\n**Tip for using this output in class**: Integrate these activities into daily classroom routines to promote sharing and cooperation. Use the grouping and re-grouping ideas to create dynamic teams, fostering flexibility and collaboration among students."
            },
            grade4_6: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for simple group projects (e.g., a class play, a science presentation); suggest roles for group members (e.g., researcher, presenter, artist); create shared document templates for collaborative writing assignments (e.g., group story); or design simple problems that require students to combine their knowledge. **GenAI can intentionally introduce a minor conflicting requirement within a problem to necessitate negotiation (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through facilitating brainstorming and assign roles for simple group projects for 4th-6th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To help my 4th-6th graders work together effectively')?\n2. What is the topic of the group project (e.g., a class play, a science presentation)?\n3. How many diverse project ideas would you like?\n4. How many roles (e.g., researcher, presenter, artist) should GenAI suggest for group members?\n5. Would you like a simple template for a collaborative group story, and if so, what theme?\n\n**Tip for using this output in class**: Use the generated project ideas and roles to organize collaborative learning. Encourage groups to use the shared document templates for their writing assignments. The conflicting requirements in problems can be used to teach negotiation and compromise skills within group work."
            },
            grade7_10: {
                text: "Facilitate brainstorming sessions by generating diverse ideas for group projects; suggest roles and responsibilities for group members; create shared document templates for collaborative writing or project planning; or design complex problems that genuinely require multiple perspectives and shared understanding to solve effectively. **GenAI can simulate a group member who subtly shifts their position, requiring active listening and adaptive responses (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through designing complex problems for collaborative solving among 7th-10th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To improve group problem-solving for my 7th-10th graders')?\n2. What subject area should the problem be from (e.g., environmental science, historical analysis)?\n3. What disciplines should the problem require combining knowledge from (e.g., biology and chemistry)?\n4. How many roles should GenAI suggest for group members?\n\n**Tip for using this output in class**: Implement these complex problems as extended group projects. Encourage students to leverage each other's strengths based on suggested roles. The simulated shifting positions of group members can be incorporated into role-playing exercises to develop active listening and adaptive communication skills critical for collaborative work."
            },
            grade11_12: {
                text: "Facilitate advanced brainstorming sessions for highly complex, interdisciplinary group projects; dynamically suggest specialized roles based on team strengths and project needs; create sophisticated collaborative workspace templates (e.g., integrated planning, research, and drafting modules); or design wicked problems and grand challenges that demand authentic collaboration, negotiation, and synthesis of diverse expertise. **GenAI can introduce an unexpected external constraint or resource change during a project, forcing the group to pivot their strategy (desirable difficulty).**",
                prompt: "**Your Role**: You are a helpful AI assistant creating educational materials for teachers. Your goal is to guide the teacher step-by-step through designing wicked problems for authentic collaboration among 11th-12th graders.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask me the next question until the previous one is clearly answered.\n1. What is your specific learning objective (e.g., 'To engage my 11th-12th graders in complex, real-world challenges')?\n2. What global issue or grand challenge should the problem relate to (e.g., designing a sustainable city, addressing food insecurity)?\n3. How many specialized roles should GenAI dynamically suggest based on team strengths?\n(GenAI will introduce external constraints or resource changes during the project to foster strategic adaptation.)\n\n**Tip for using this output in class**: Assign these wicked problems as capstone projects or extended simulations. Facilitate discussions where teams must adapt to unexpected constraints, mirroring real-world project management. Encourage students to reflect on their collaborative process and the effectiveness of their strategic pivots."
            }
        },
        studentInteractions: {
            preK3: {
                text: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with.",
                prompt: "Direct GenAI interaction is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade4_6: {
                text: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on supervised learning activities. GenAI can generate tailored resources that teachers then use to facilitate student learning.",
                prompt: "Direct GenAI interaction for independent use is not recommended for this age group. Teachers should mediate the use of GenAI with younger learners, focusing on co-creation and guided exploration. GenAI can support teachers in generating age-appropriate content for students to then interact with."
            },
            grade7_10: {
                text: "Students can use GenAI as a shared brainstorming tool for generating initial ideas for group projects; a resource for collective problem-solving (e.g., 'How can our team best approach this challenge, considering X, Y, and Z factors?'); a neutral party to synthesize different group members' ideas into a coherent summary; or to simulate scenarios where team decisions and negotiations are required. **GenAI can present two equally plausible but mutually exclusive solutions and ask the group to justify their chosen compromise (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI brainstorming facilitator. Your goal is to guide me step-by-step to help me and my group generate ideas for our project and identify the strongest one.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What type of group project are you working on (e.g., a renewable energy project, a historical presentation)?\n3. After brainstorming, GenAI will ask you to identify the *single strongest* idea generated and explain your reasoning."
            },
            grade11_12: {
                text: "Students can use GenAI as a sophisticated collaborative brainstorming partner, generating divergent and convergent ideas for complex team challenges; a comprehensive resource for advanced collective problem-solving (e.g., 'Given these constraints, how can our team optimize this engineering solution?'); a neutral facilitator to synthesize highly complex, disparate group contributions into actionable plans or comprehensive reports; or to simulate intricate scenarios requiring strategic team decision-making, negotiation, and conflict resolution. **GenAI can simulate a 'devil's advocate' role, intentionally poking holes in the group's proposed solution to force deeper justification and refinement (desirable difficulty).**",
                prompt: "**Your Role**: You are an AI collaborative partner. Your goal is to guide me step-by-step to help me and my team develop innovative and robust solutions for complex challenges.\n\n**GenAI will guide you step-by-step**: I will *only* ask question 1. You will answer, and then I will ask the next question. If your answer is unclear, I will probe to clarify. I will not ask the next question until the previous one is clearly answered.\n1. What is your learning goal?\n2. What complex team challenge are you facing (e.g., designing a sustainable city, optimizing a supply chain)?\n3. After you propose a solution, GenAI will simulate a 'devil's advocate' role, presenting strong counter-arguments for you to refine and justify your solution."
            }
        },
        humanAiHumanTip: "Human-AI-Human Tip: Teachers set discussion norms (Human), GenAI provides initial prompts or different viewpoints (AI), and students engage in meaningful peer-to-peer dialogue (Human)." ,
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
    const [showCopiedNotification, setShowCopiedNotification] = useState(false);

    // Function to copy text to clipboard
    const handleCopy = () => {
        const promptElement = document.getElementById('prompt-text-content');
        if (promptElement) {
            const range = document.createRange();
            range.selectNode(promptElement);
            window.getSelection().removeAllRanges(); // Clear current selection
            window.getSelection().addRange(range); // Select the text
            try {
                document.execCommand('copy'); // Copy the selected text
                setShowCopiedNotification(true);
                setTimeout(() => {
                    setShowCopiedNotification(false);
                }, 1500); // Hide after 1.5 seconds
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            window.getSelection().removeAllRanges(); // Deselect the text
        }
    };

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
                    <pre
                        id="prompt-text-content" // Added ID for clipboard copy
                        className="whitespace-pre-wrap font-mono text-gray-700 select-all"
                        onClick={handleCopy} // Added onClick event for touch devices
                        style={{ cursor: 'pointer' }} // Indicate it's clickable
                    >
                        {promptText}
                    </pre>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    Open your preferred GenAI tool, copy this prompt as is, and submit. Interact with the tool by answering its questions to fill in the context.
                </p>

                {showCopiedNotification && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm transition-opacity duration-300">
                        Copied!
                    </div>
                )}
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
                        <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-2">
                            {currentCard.description}
                        </p>
                        {/* New section for simple example */}
                        <p className="text-sm sm:text-base leading-relaxed text-gray-600 italic mb-4">
                            {currentCard.simpleExample}
                        </p>
                        <p className="mt-auto text-violet-600 font-semibold text-lg sm:text-xl transform transition-transform duration-300 animate-pulse">
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

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .animate-pulse {
                    animation: pulse 1.5s infinite;
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
                    <p>
                        Mollick, E., & Mollick, L. (2023). *Assigning AI: Seven Approaches for Students, with Prompts*. Wharton School of the University of Pennsylvania & Wharton Interactive. Retrieved from https://ssrn.com/abstract=4475995
                    </p>
                    <p>
                        Mollick, E., & Mollick, L. (2023). *Using AI to Implement Effective Teaching Strategies in Classrooms: Five Strategies, Including Prompts*. Wharton School of the University of Pennsylvania & Wharton Interactive. Retrieved from https://ssrn.com/abstract=4391243
                    </p>
                    <p className="mt-2 text-gray-500 text-xs">Co-created with Google Gemini</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
