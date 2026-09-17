-- Restaurant
INSERT INTO restaurant
(id, name, address, phone, description)
VALUES
(1, 'La Rose Sucre', 'Tripoli', '70542829', 'Restaurant menu');


-- Menu Items
INSERT INTO menu_item
(id, name, description, price, available, restaurant_id)
VALUES

-- Pasta
(1, 'باستا فاهيتا - Small', 'Pasta Fahita Small', 250000, true, 1),
(2, 'باستا فاهيتا - Medium', 'Pasta Fahita Medium', 350000, true, 1),
(3, 'باستا فاهيتا - Large', 'Pasta Fahita Large', 450000, true, 1),

(4, 'باستا سبيسيال - Small', 'Pasta Special Small', 250000, true, 1),
(5, 'باستا سبيسيال - Medium', 'Pasta Special Medium', 350000, true, 1),
(6, 'باستا سبيسيال - Large', 'Pasta Special Large', 450000, true, 1),

(7, 'باستا مكسيكانا - Small', 'Pasta Mexicana Small', 250000, true, 1),
(8, 'باستا مكسيكانا - Medium', 'Pasta Mexicana Medium', 350000, true, 1),
(9, 'باستا مكسيكانا - Large', 'Pasta Mexicana Large', 450000, true, 1),

(10, 'باستا فور تشيز - Small', 'Pasta Four Cheese Small', 250000, true, 1),
(11, 'باستا فور تشيز - Medium', 'Pasta Four Cheese Medium', 350000, true, 1),
(12, 'باستا فور تشيز - Large', 'Pasta Four Cheese Large', 450000, true, 1),

-- Crepe & Waffle
(13, 'كريب شوكولا', 'Chocolate Crepe', 200000, true, 1),
(14, 'وافل وايت / دارك / شوكولا', 'Chocolate Waffle', 250000, true, 1),
(15, 'كريب كيتكات / وافل كندر', 'Kitkat Crepe Kinder Waffle', 300000, true, 1),
(16, 'نوتيلا كريب', 'Nutella Crepe', 330000, true, 1),
(17, 'كريب بانكيك / وافل لوتس', 'Pancake Lotus Waffle', 350000, true, 1),
(18, 'وافل بيستاشيو', 'Pistachio Waffle', 400000, true, 1),
(19, 'كريب فواكه', 'Fruit Crepe', 450000, true, 1),
(20, 'وافل دبي / كريب دبي', 'Dubai Waffle Crepe', 500000, true, 1),

-- Add-ons
(21, 'شوكولا إضافة', 'Chocolate Add-on', 30000, true, 1),
(22, 'موز إضافة', 'Banana Add-on', 40000, true, 1),
(23, 'فستق حلبي إضافة', 'Pistachio Add-on', 50000, true, 1),
(24, 'أوريو إضافة', 'Oreo Add-on', 50000, true, 1),
(25, 'براوني إضافة', 'Brownie Add-on', 50000, true, 1),

-- Corn
(26, 'ذرة مكسيكانا - Small', 'Mexicana Corn Small', 250000, true, 1),
(27, 'ذرة مكسيكانا - Medium', 'Mexicana Corn Medium', 350000, true, 1),
(28, 'ذرة مكسيكانا - Large', 'Mexicana Corn Large', 450000, true, 1),

-- Desserts
(29, 'جلو', 'Jello', 50000, true, 1),
(30, 'رز بحليب / كاستر', 'Rice pudding / Custard', 100000, true, 1),
(31, 'تشيز كيك أوريو', 'Oreo Cheesecake', 150000, true, 1),
(32, 'تشيز كيك / تيراميسو', 'Cheesecake Tiramisu', 200000, true, 1),
(33, 'سان سيباستيان', 'San Sebastian', 300000, true, 1),

-- Beverages
(34, 'ماء صغير', 'Small Water', 30000, true, 1),
(35, 'بيبسي تنك / عصير زويا', 'Pepsi / Zoya Juice', 70000, true, 1),
(36, 'عصير ليو / فريز', 'Leo / Strawberry Juice', 100000, true, 1),
(37, 'عصير سموذي', 'Smoothie', 140000, true, 1),

-- More Pasta
(38, 'باستا فور تشيز - Small', 'Four Cheese Pasta Small', 250000, true, 1),
(39, 'باستا فور تشيز - Medium', 'Four Cheese Pasta Medium', 350000, true, 1),
(40, 'باستا فور تشيز - Large', 'Four Cheese Pasta Large', 450000, true, 1),

(41, 'باستا كاري - Small', 'Curry Pasta Small', 250000, true, 1),
(42, 'باستا كاري - Medium', 'Curry Pasta Medium', 350000, true, 1),
(43, 'باستا كاري - Large', 'Curry Pasta Large', 450000, true, 1),

(44, 'باستا باربيكيو - Small', 'BBQ Pasta Small', 250000, true, 1),
(45, 'باستا باربيكيو - Medium', 'BBQ Pasta Medium', 350000, true, 1),
(46, 'باستا باربيكيو - Large', 'BBQ Pasta Large', 450000, true, 1),

(47, 'باستا تورنيدو - Small', 'Tornado Pasta Small', 250000, true, 1),
(48, 'باستا تورنيدو - Medium', 'Tornado Pasta Medium', 350000, true, 1),
(49, 'باستا تورنيدو - Large', 'Tornado Pasta Large', 450000, true, 1),

(50, 'باستا تاكيز - Small', 'Takis Pasta Small', 250000, true, 1),
(51, 'باستا تاكيز - Medium', 'Takis Pasta Medium', 350000, true, 1),
(52, 'باستا تاكيز - Large', 'Takis Pasta Large', 450000, true, 1),

(53, 'باستا نودلز - Small', 'Noodles Pasta Small', 250000, true, 1),
(54, 'باستا نودلز - Medium', 'Noodles Pasta Medium', 350000, true, 1),
(55, 'باستا نودلز - Large', 'Noodles Pasta Large', 450000, true, 1),

(56, 'باستا بيستو - Small', 'Pesto Pasta Small', 250000, true, 1),
(57, 'باستا بيستو - Medium', 'Pesto Pasta Medium', 350000, true, 1),
(58, 'باستا بيستو - Large', 'Pesto Pasta Large', 450000, true, 1),


-- More Crepe & Waffle
(59, 'كريب لوتس', 'Lotus Crepe', 350000, true, 1),
(60, 'كريب كندر', 'Kinder Crepe', 350000, true, 1),
(61, 'كريب ميتو', 'Meto Crepe', 350000, true, 1),

(62, 'كريب سادة - Small', 'Plain Crepe Small', 250000, true, 1),
(63, 'كريب سادة - Medium', 'Plain Crepe Medium', 350000, true, 1),
(64, 'كريب سادة - Large', 'Plain Crepe Large', 450000, true, 1),


-- More Add-ons
(65, 'لوتس بسكويت إضافة', 'Lotus Biscuit Add-on', 60000, true, 1),
(66, 'فريز إضافة', 'Strawberry Add-on', 100000, true, 1),
(67, 'أناناس إضافة', 'Pineapple Add-on', 100000, true, 1),
(68, 'كندر إضافة', 'Kinder Add-on', 100000, true, 1),
(69, 'كيتكات إضافة', 'KitKat Add-on', 100000, true, 1),
(70, 'تويكس إضافة', 'Twix Add-on', 100000, true, 1),
(71, 'كريمه إضافة', 'Cream Add-on', 100000, true, 1),


-- More Corn
(72, 'ذرة فور تشيز - Small', 'Four Cheese Corn Small', 250000, true, 1),
(73, 'ذرة فور تشيز - Medium', 'Four Cheese Corn Medium', 350000, true, 1),
(74, 'ذرة فور تشيز - Large', 'Four Cheese Corn Large', 450000, true, 1),

(75, 'ذرة باربيكيو - Small', 'BBQ Corn Small', 250000, true, 1),
(76, 'ذرة باربيكيو - Medium', 'BBQ Corn Medium', 350000, true, 1),
(77, 'ذرة باربيكيو - Large', 'BBQ Corn Large', 450000, true, 1),

(78, 'جلو', 'Jello', 50000, true, 1),

(79, 'رز بحليب', 'Rice Pudding', 100000, true, 1),
(80, 'كاستر', 'Custard', 100000, true, 1),

(81, 'تشيز كيك أوريو', 'Oreo Cheesecake', 150000, true, 1),
(82, 'كريم باتيسير فواكه', 'Fruit Cream Pastry', 150000, true, 1),

(83, 'تشيز كيك', 'Cheesecake', 200000, true, 1),
(84, 'بسكويت تشيز', 'Biscuit Cheesecake', 200000, true, 1),
(85, 'تيراميسو', 'Tiramisu', 200000, true, 1),

(86, 'سان سيباستيان', 'San Sebastian', 300000, true, 1),

(87, 'قالب كيك', 'Cake Mold', 1800000, true, 1),


-- Beverages

(88, 'ماء صغير', 'Small Water', 30000, true, 1),

(89, 'بيبسي تنك', 'Pepsi Can', 70000, true, 1),
(90, 'عصير زويا', 'Zoya Juice', 70000, true, 1),

(91, 'عصير ليو', 'Leo Juice', 100000, true, 1),
(92, 'عصير فريز', 'Strawberry Juice', 100000, true, 1),

(93, 'عصير سموذي', 'Smoothie', 140000, true, 1);