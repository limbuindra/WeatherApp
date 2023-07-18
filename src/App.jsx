import { useState, useEffect } from "react";

import axios from "axios";
import {
	IoMdSunny,
	IoMdRainy,
	IoMdCloudy,
	IoMdThunderstorm,
	IoMdSearch,
	IoMdSnow,
} from "react-icons/io";

import {
	BsCloudHaze2Fill,
	BsCloudDrizzleFill,
	BsEye,
	BsWater,
	BsWind,
	BsThermometer,
} from "react-icons/bs";

import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

function App() {
	const [data, setData] = useState(null);
	const [location, setLocation] = useState("kathmandu ");
	const [inputValue, setInputValue] = useState("");
	const [animate, setAnimate] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const handleInput = (e) => {
		setInputValue(e.target.value);
	};

	const handleSubmit = (e) => {
		console.log(inputValue);
		if (inputValue !== "") {
			setLocation(inputValue);
		}

		//select input
		const input = document.querySelector("input");

		if (input.value === "") {
			setAnimate(true);
			setTimeout(() => {
				setAnimate(false);
			}, 500);
		}
		input.value = "";
		e.preventDefault();
	};

	useEffect(() => {
		setLoading(true);
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=af30d1d5049cb2cc743dcea49ca96bdc`;
		axios
			.get(url)
			.then((response) => {
				setTimeout(() => {
					setData(response.data);
					setLoading(false);
				}, 1000);
			})
			.catch((err) => {
				setLoading(false);
				setErrorMsg(err);
			});
	}, [location]);

	//error message
	useEffect(() => {
		const timer = setTimeout(() => {
			setErrorMsg("");
		}, 1500);
		return () => clearTimeout(timer);
	}, [errorMsg]);

	//If data is false show the loader
	if (!data) {
		return (
			<div className="bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500   w-full h-screen flex flex-col justify-center items-center">
				<div>
					<ImSpinner8 className="text-7xl animate-spin text-white  " />
				</div>
			</div>
		);
	}


	let icon;
	console.log(data.message);
	switch (data.weather[0].main) {
		case "Clouds":
			icon = <IoMdCloudy />;

			break;
		case "Haze":
			icon = <BsCloudHaze2Fill />;
			break;
		case "Rain":
			icon = <IoMdRainy className="text-blue-500" />;
			break;
		case "Clear":
			icon = <IoMdSunny className="text-yellow-400" />;
			break;
		case "Drizzle":
			icon = <BsCloudDrizzleFill className="text-blue-300" />;
			break;
		case "Snow":
			icon = <IoMdSnow />;
			break;
		case "Thunderstorm":
			icon = <IoMdThunderstorm />;
			break;
	}

	const date = new Date();
	return (
		<>
			<div className="bg-gradient-to-r bg-cover from-indigo-600 via-purple-300 to-pink-400  h-screen w-full flex  flex-col  justify-center items-center px-4 lg:px-0 ">
				{/* card */}
				{errorMsg && (
					<div className="w-full text-lg max-w-[60vw] md:max-w-[430px] bg-pink-500 text-white absolute top-4 md:top-4 p-3 capitalize rounded-lg text-center">
						{"City not found"}
					</div>
				)}
				<form
					className={`${
						animate ? "animate-bounce" : "animate-none "
					} h-16 bg-black/30 w-full max-w-[430px] rounded-full backdrop-blur-[32px] mb-3 `}
				>
					<div className="h-full relative flex items-center justify-center p-2">
						<input
							onChange={(e) => handleInput(e)}
							type="text"
							placeholder="Search by city or country"
							className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-lg font-light pl-6 h-full"
						/>
						<button
							onClick={(e) => handleSubmit(e)}
							className="bg-blue-500 w-20 h-12 rounded-full flex justify-center  items-center  transition hover:bg-blue-400"
						>
							<IoMdSearch className="text-2xl text-white" />
						</button>
					</div>
				</form>

				<div
					className="w-full max-w-[430px] bg-black/30 
				min-h-[500px] text-white backdrop-blur-[32px] rounded-[39px] py-10 px-8 "
				>
					{loading ? (
						<div className="w-full h-full  flex justify-center items-center">
							<ImSpinner8 className="text-white text-7xl animate speed animate-spin" />
						</div>
					) : (
						<div>
							<div className=" flex  items-center gap-x-5 ">
								<div className="text-[85px]">{icon}</div>
								<div>
									<div className="text-3xl font-semibold ">
										{data.name}, {data.sys.country}
									</div>
									{/* date */}
									<div>
										{date.getUTCDate()}/{date.getUTCMonth() + 1}/ 
										{date.getUTCFullYear()}
									</div>
								</div>
							</div>

							<div className=" my-10 ">
								<div className="flex justify-center items-center ">
									{/* temp */}
									<div className="text-[144px] leading-none font-light">
										{parseInt(data.main.temp)}
									</div>
									<div className="text-4xl">
										<TbTemperatureCelsius />
									</div>
								</div>
								{/* weather description */}
								<div className="capitalize font-medium text-center ">
									{data.weather[0].description}
								</div>
							</div>
							<div className="max-w-[378px] mx-auto flex flex-col gap-y-4">
								<div className="flex justify-between">
									<div className="flex  items-center gap-x-2 ">
										<div className="text-[20px]">
											<BsEye />
										</div>
										<div>
											Visibility
											<span className="ml-2">{data.visibility / 1000}km</span>
										</div>
									</div>
									<div className="flex  items-center gap-x-2 ">
										<div className="text-[20px]">
											<BsThermometer />
										</div>
										<div className="flex">
											Feels like
											<div className="flex ml-2">
												{parseInt(data.main.feels_like)}
												<TbTemperatureCelsius />
											</div>
										</div>
									</div>
								</div>
								<div className="flex justify-between">
									<div className="flex  items-center gap-x-2 ">
										<div className="text-[20px]">
											<BsWater />
										</div>
										<div>
											Humidity
											<span className="ml-2">{data.main.humidity} %</span>
										</div>
									</div>
									<div className="flex  items-center gap-x-2 ">
										<div className="text-[20px]">
											<BsWind />
										</div>
										<div>
											Wind
											<span className=" ml-2">{data.wind.speed}m/s</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
