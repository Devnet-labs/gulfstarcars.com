const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

// Enum translations for all languages
const carEnums = {
    'en.json': {
        condition: { New: 'New', Used: 'Used' },
        fuelType: { Petrol: 'Petrol', Diesel: 'Diesel', Hybrid: 'Hybrid', Electric: 'Electric' },
        transmission: { Automatic: 'Automatic', Manual: 'Manual' },
        driveType: { '2WD': '2WD', '4WD': '4WD', AWD: 'AWD' },
        steering: { LHD: 'LHD (Left Hand Drive)', RHD: 'RHD (Right Hand Drive)' },
        bodyType: { SUV: 'SUV', Sedan: 'Sedan', Coupe: 'Coupe', Pickup: 'Pickup', Van: 'Van', Hatchback: 'Hatchback', Convertible: 'Convertible', Wagon: 'Wagon' },
        status: { AVAILABLE: 'Available', SOLD: 'Sold', RESERVED: 'Reserved' },
    },
    'ar.json': {
        condition: { New: 'جديد', Used: 'مستعمل' },
        fuelType: { Petrol: 'بنزين', Diesel: 'ديزل', Hybrid: 'هجين', Electric: 'كهربائي' },
        transmission: { Automatic: 'أوتوماتيك', Manual: 'يدوي' },
        driveType: { '2WD': 'دفع ثنائي', '4WD': 'دفع رباعي', AWD: 'دفع كلي' },
        steering: { LHD: 'مقود يسار', RHD: 'مقود يمين' },
        bodyType: { SUV: 'دفع رباعي', Sedan: 'سيدان', Coupe: 'كوبيه', Pickup: 'بيك أب', Van: 'فان', Hatchback: 'هاتشباك', Convertible: 'مكشوفة', Wagon: 'ستيشن' },
        status: { AVAILABLE: 'متاح', SOLD: 'مباع', RESERVED: 'محجوز' },
    },
    'fr.json': {
        condition: { New: 'Neuf', Used: 'Occasion' },
        fuelType: { Petrol: 'Essence', Diesel: 'Diesel', Hybrid: 'Hybride', Electric: 'Électrique' },
        transmission: { Automatic: 'Automatique', Manual: 'Manuelle' },
        driveType: { '2WD': '2 roues motrices', '4WD': '4 roues motrices', AWD: 'Intégrale' },
        steering: { LHD: 'Conduite à gauche', RHD: 'Conduite à droite' },
        bodyType: { SUV: 'SUV', Sedan: 'Berline', Coupe: 'Coupé', Pickup: 'Pick-up', Van: 'Fourgon', Hatchback: 'Berline compacte', Convertible: 'Cabriolet', Wagon: 'Break' },
        status: { AVAILABLE: 'Disponible', SOLD: 'Vendu', RESERVED: 'Réservé' },
    },
    'es.json': {
        condition: { New: 'Nuevo', Used: 'Usado' },
        fuelType: { Petrol: 'Gasolina', Diesel: 'Diésel', Hybrid: 'Híbrido', Electric: 'Eléctrico' },
        transmission: { Automatic: 'Automático', Manual: 'Manual' },
        driveType: { '2WD': '2WD', '4WD': '4WD', AWD: 'AWD' },
        steering: { LHD: 'Volante izquierdo', RHD: 'Volante derecho' },
        bodyType: { SUV: 'SUV', Sedan: 'Sedán', Coupe: 'Coupé', Pickup: 'Pickup', Van: 'Furgoneta', Hatchback: 'Hatchback', Convertible: 'Convertible', Wagon: 'Familiar' },
        status: { AVAILABLE: 'Disponible', SOLD: 'Vendido', RESERVED: 'Reservado' },
    },
    'pt.json': {
        condition: { New: 'Novo', Used: 'Usado' },
        fuelType: { Petrol: 'Gasolina', Diesel: 'Diesel', Hybrid: 'Híbrido', Electric: 'Elétrico' },
        transmission: { Automatic: 'Automático', Manual: 'Manual' },
        driveType: { '2WD': '2WD', '4WD': '4WD', AWD: 'AWD' },
        steering: { LHD: 'Direção esquerda', RHD: 'Direção direita' },
        bodyType: { SUV: 'SUV', Sedan: 'Sedan', Coupe: 'Coupé', Pickup: 'Picape', Van: 'Van', Hatchback: 'Hatchback', Convertible: 'Conversível', Wagon: 'Perua' },
        status: { AVAILABLE: 'Disponível', SOLD: 'Vendido', RESERVED: 'Reservado' },
    },
    'ru.json': {
        condition: { New: 'Новый', Used: 'Б/У' },
        fuelType: { Petrol: 'Бензин', Diesel: 'Дизель', Hybrid: 'Гибрид', Electric: 'Электро' },
        transmission: { Automatic: 'Автомат', Manual: 'Механика' },
        driveType: { '2WD': 'Задний привод', '4WD': 'Полный привод', AWD: 'AWD' },
        steering: { LHD: 'Левый руль', RHD: 'Правый руль' },
        bodyType: { SUV: 'Внедорожник', Sedan: 'Седан', Coupe: 'Купе', Pickup: 'Пикап', Van: 'Фургон', Hatchback: 'Хэтчбек', Convertible: 'Кабриолет', Wagon: 'Универсал' },
        status: { AVAILABLE: 'В наличии', SOLD: 'Продан', RESERVED: 'Зарезервирован' },
    },
    'zh.json': {
        condition: { New: '全新', Used: '二手' },
        fuelType: { Petrol: '汽油', Diesel: '柴油', Hybrid: '混合动力', Electric: '电动' },
        transmission: { Automatic: '自动', Manual: '手动' },
        driveType: { '2WD': '两驱', '4WD': '四驱', AWD: '全轮驱动' },
        steering: { LHD: '左舵', RHD: '右舵' },
        bodyType: { SUV: 'SUV', Sedan: '轿车', Coupe: '轿跑', Pickup: '皮卡', Van: '面包车', Hatchback: '掀背车', Convertible: '敞篷车', Wagon: '旅行车' },
        status: { AVAILABLE: '在售', SOLD: '已售', RESERVED: '已预订' },
    },
};

const files = fs.readdirSync(messagesDir);

files.forEach((file) => {
    if (!file.endsWith('.json')) return;
    if (!carEnums[file]) {
        console.log(`⚠️ Skipping ${file} — no enum translations defined`);
        return;
    }

    const filePath = path.join(messagesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    content.carEnums = carEnums[file];

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`✅ Updated ${file} with carEnums`);
});

console.log('\n🎉 All language files updated with enum translations!');
