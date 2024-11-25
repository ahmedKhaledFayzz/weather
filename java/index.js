// OpenWeatherMap API Key
const API_KEY = '85cba63ffb5b56ae89918b8a84c164e7'; // استبدل YOUR_API_KEY_HERE بمفتاحك الخاص

// عناصر DOM
const cityInput = document.querySelector('.form-control');
const findButton = document.querySelector('.btn');
const weatherCards = document.querySelector('.row');

// وظيفة لجلب بيانات الطقس باستخدام اسم المدينة
async function getWeatherByCity(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== '200') {
            alert('City not found. Please try again.');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// وظيفة لجلب بيانات الطقس باستخدام الإحداثيات
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== '200') {
            alert('Could not fetch weather data for your location.');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// وظيفة لعرض بيانات الطقس
function displayWeather(data) {
    // تفريغ البطاقات القديمة
    weatherCards.innerHTML = '';

    // عرض اسم المدينة
    const cityName = data.city.name;
    const country = data.city.country;

    const cityHeading = `
        <div class="col-12 mb-4">
            <h2 class="text-white">${cityName}, ${country}</h2>
        </div>
    `;

    // إضافة اسم المدينة في بداية القسم
    weatherCards.innerHTML += cityHeading;

    // عرض بيانات الأيام الثلاثة الأولى
    for (let i = 0; i < 3; i++) {
        const dayData = data.list[i * 8]; // بيانات كل يوم (كل 8 ساعات)

        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temperature = Math.round(dayData.main.temp);
        const weather = dayData.weather[0].description;
        const icon = dayData.weather[0].icon;

        // رابط مشاركة الطقس على WhatsApp
        const whatsappMessage = encodeURIComponent(
            `Weather update for ${cityName}, ${country} on ${dayName}:\nTemperature: ${temperature}°C\nCondition: ${weather.charAt(0).toUpperCase() + weather.slice(1)}`
        );
        const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

        // إنشاء بطاقة الطقس مع زر WhatsApp
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark text-white p-3" style="border-radius: 15px;">
                    <h3>${dayName}</h3>
                    <h1>${temperature}°C</h1>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" />
                    <p>${weather.charAt(0).toUpperCase() + weather.slice(1)}</p>
                    <a href="${whatsappLink}" target="_blank" class="btn btn-success mt-3" style="border-radius: 25px; font-weight: bold;">
                        <i class="fab fa-whatsapp"></i> Share on WhatsApp
                    </a>
                </div>
            </div>
        `;

        weatherCards.innerHTML += card;
    }
}


// البحث عند الضغط على زر "Find"
findButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Please enter a city name.');
    }
});

// البحث التلقائي بناءً على موقع المستخدم
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Could not fetch your location. Please search manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

