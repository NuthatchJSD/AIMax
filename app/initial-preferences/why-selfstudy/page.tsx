"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

interface Data {
	[key: string]: any | null;
}

const pushPreferences = async () => {
	console.log("Pushing preferences to the server...");
	// Extract information from localStorage
	const studyReason = localStorage.getItem("studyReason");
	const studyMethods = localStorage.getItem("studyMethods");
	const studyLocation = localStorage.getItem("studyLocation");
	const studyGoals = localStorage.getItem("studyGoal");
	const specialAttention = localStorage.getItem("specialAttention");
	const pronouns = localStorage.getItem("pronouns");
	const programmingLearnLanguages = localStorage.getItem(
		"programmingLearnLanguages"
	);
	const programmingLanguages = localStorage.getItem("programmingLanguages");
	const language = localStorage.getItem("language");
	const interestTopics = localStorage.getItem("interestTopics");
	const genderIdentify = localStorage.getItem("genderIdentify");
	const favTech = localStorage.getItem("favTech");
	const easyDistract = localStorage.getItem("easyDistract");
	const selectedOptions = localStorage.getItem("selectedOptions");

	const data: Data = {
		studyReason,
		studyMethods,
		studyLocation,
		studyGoals,
		specialAttention,
		pronouns,
		programmingLearnLanguages,
		programmingLanguages,
		language,
		interestTopics,
		genderIdentify,
		favTech,
		easyDistract,
		selectedOptions,
	};

	function parseValue(value: string): any {
		try {
			const parsedValue = JSON.parse(value);

			if (typeof parsedValue === "object" && parsedValue !== null) {
				// Filter out empty key-value pairs and empty arrays from objects
				for (const key in parsedValue) {
					if (
						parsedValue[key] === null ||
						parsedValue[key] === "" ||
						(Array.isArray(parsedValue[key]) && parsedValue[key].length === 0)
					) {
						delete parsedValue[key];
					}
				}
			}
			return parsedValue;
		} catch (e) {
			// Return the value as is if not JSON-like
			return value;
		}
	}

	const parsedData: Partial<Data> = {};
	for (const key in data) {
		if (data[key] !== null && data[key] !== "") {
			parsedData[key as keyof Data] = parseValue(data[key] as string);
		}
	}

	console.log("Preferences:", data);
};

export default function StudyReason() {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const router = useRouter();
	const currentPageIndex = pages.indexOf("/initial-preferences/why-selfstudy");

	useEffect(() => {
		const savedOption = localStorage.getItem("studyReason");
		if (savedOption) {
			setSelectedOption(savedOption);
		}
	}, []);

	const toggleSelection = (option: string) => {
		setSelectedOption(option);
	};

	const saveSelection = async () => {
		if (selectedOption) {
			localStorage.setItem("studyReason", selectedOption);
			await pushPreferences();
			router.push("/");
		} else {
			alert("Por favor seleccione una opción.");
		}
	};

	const goBack = () => {
		if (currentPageIndex > 0) {
			router.push(pages[currentPageIndex - 1]);
		} else {
			alert("Esta es la primera página");
		}
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 flex items-center justify-center bg-custom-yellow'>
				<PageTransition>
					<QuestionHeader
						title='¿Por qué estás estudiando por tu cuenta?'
						description='Selecciona una opción'
					/>
					<div className='flex max-w-2xl flex-wrap justify-center mb-4'>
						{[
							"Para aprender más",
							"Conseguir un trabajo",
							"Conseguir un internship",
							"Ayuda extra para mi carrera",
							"Reforzar temas",
						].map((option) => (
							<SelectionButton
								key={option}
								option={option}
								isSelected={selectedOption === option}
								onSelect={toggleSelection}
							/>
						))}
					</div>
				</PageTransition>
			</div>
			<Footer onBack={goBack} onNext={saveSelection} />
		</div>
	);
}
