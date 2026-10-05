// Built-in food table behind the diary's "estimate" button. Rough values per
// 100 g, rounded, in the spirit of common Italian nutrition tables: good for
// "a general idea", not for medical use (expect ±20–30%). Weights are as
// bought/eaten: pasta, rice and legumes are DRY (crudo) unless noted.
//
// To add a food: a `name`, the `words` that trigger it (lower case, no
// accents; list singular and plural; matched as whole words), the values per
// 100 g and a typical `portion` in grams used when no grams are entered.

export interface Food {
  name: string
  words: string[]
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
  /** Typical portion in grams, used when the entry has no grams. */
  portion: number
}

const f = (name: string, words: string[], kcal: number, proteinG: number, carbsG: number, fatG: number, portion: number): Food => ({
  name, words, kcal, proteinG, carbsG, fatG, portion,
})

export const FOODS: Food[] = [
  // Cereals and bakery
  f('pasta (dry)', ['pasta', 'spaghetti', 'penne', 'fusilli', 'rigatoni', 'tagliatelle', 'tortellini', 'gnocchi'], 350, 12, 72, 1.5, 80),
  f('rice (dry)', ['riso', 'risotto'], 350, 7, 79, 1, 80),
  f('bread', ['pane', 'panino', 'piadina', 'focaccia'], 270, 9, 58, 1, 60),
  f('pizza', ['pizza'], 270, 11, 33, 10, 300),
  f('breakfast cereals', ['cereali', 'muesli', 'corn flakes', 'fiocchi'], 375, 8, 75, 4, 40),
  f('rusks', ['fette biscottate'], 400, 11, 74, 6, 30),
  f('biscuits', ['biscotti', 'biscotto', 'frollini'], 430, 7, 72, 12, 30),
  f('croissant', ['cornetto', 'brioche', 'croissant'], 400, 7, 48, 20, 60),
  // Meat, fish, eggs
  f('chicken breast', ['pollo', 'petto di pollo', 'tacchino'], 110, 23, 0, 1.5, 150),
  f('beef', ['manzo', 'bistecca', 'vitello', 'tagliata', 'hamburger'], 180, 20, 0, 10, 150),
  f('cooked ham', ['prosciutto cotto'], 215, 20, 1, 14, 50),
  f('cured ham', ['prosciutto', 'prosciutto crudo', 'speck', 'bresaola'], 250, 25, 0, 16, 50),
  f('salmon', ['salmone'], 200, 20, 0, 13, 150),
  f('canned tuna', ['tonno'], 100, 24, 0, 1, 80),
  f('white fish', ['pesce', 'merluzzo', 'orata', 'branzino', 'spigola'], 80, 17, 0, 1, 150),
  f('egg', ['uovo', 'uova', 'frittata'], 140, 12.5, 1, 10, 60),
  // Dairy
  f('milk', ['latte'], 64, 3.3, 4.9, 3.6, 200),
  f('yogurt', ['yogurt'], 66, 4, 5, 3.5, 125),
  f('mozzarella', ['mozzarella'], 250, 18, 1, 19, 125),
  f('hard cheese', ['parmigiano', 'grana', 'pecorino', 'formaggio'], 390, 33, 0, 28, 30),
  // Fruit and vegetables
  f('apple', ['mela', 'mele', 'pera', 'pere'], 52, 0.3, 14, 0.2, 150),
  f('banana', ['banana'], 90, 1, 21, 0.3, 120),
  f('orange', ['arancia', 'arance', 'mandarino', 'mandarini', 'clementine'], 45, 0.9, 10, 0.2, 150),
  f('salad', ['insalata', 'rucola'], 15, 1.4, 2.2, 0.2, 80),
  f('vegetables', ['verdura', 'verdure', 'zucchine', 'broccoli', 'spinaci', 'pomodori', 'finocchi', 'carote', 'minestrone'], 25, 2, 4, 0.3, 200),
  f('potatoes', ['patate', 'patata', 'purè'], 77, 2, 17, 0.1, 200),
  f('legumes (dry)', ['legumi', 'ceci', 'lenticchie', 'fagioli', 'piselli'], 330, 22, 50, 2, 50),
  f('nuts', ['noci', 'mandorle', 'nocciole', 'pistacchi', 'frutta secca'], 650, 15, 8, 60, 30),
  // Fats and sweets
  f('olive oil', ['olio'], 900, 0, 0, 100, 10),
  f('butter', ['burro'], 750, 0.8, 0.6, 83, 10),
  f('dark chocolate', ['cioccolato', 'cioccolata'], 540, 6, 45, 35, 20),
  f('ice cream', ['gelato'], 200, 3.5, 24, 10, 100),
  f('cake', ['torta', 'dolce', 'tiramisu', 'crostata'], 380, 5, 50, 18, 100),
  // Drinks
  f('beer', ['birra'], 43, 0.5, 3.6, 0, 330),
  f('wine', ['vino', 'prosecco'], 85, 0, 2.6, 0, 150),
]
