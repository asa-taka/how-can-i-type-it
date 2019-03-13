// Ingredients: Animals
// --------------------

interface Cat {
  type: 'cat'
  meow: string
}

interface Fish {
  type: 'fish'
}

/** All animal types */
type AnyAnimal = Cat | Fish

interface AnimalRecord {
  Cat: Cat
  Fish: Fish
}

type AnimalName = keyof AnimalRecord

// Case 1: Mapping Type to the List
// --------------------------------

type AnimalList<N extends AnimalName> = AnimalRecord[N][]
type AnimalLists = { [N in AnimalName]: AnimalList<N>}

// Sometimes, we tend to define incomplete maps to make shorthands.
// I know we thought the "undefined fields" will be well-handled
// by who will nicely refer the fields with `\\ []`...
const animalLists: Partial<AnimalLists> = {
  Cat: [
    { type: 'cat', meow: 'Did you call me?' },
  ],
}

// To make a comparison, this defineds ideal one.
const idealCompleteAnimalLists: AnimalLists = {
  Cat: [
    { type: 'cat', meow: 'Did you call me?' },
  ],
  Fish: [
    { type: 'fish' },
  ]
}

// ...and this method does that.
function getAnimalList<N extends AnimalName>(name: N): AnimalList<N> {

  // PROBLEM: It can't return `animalsList` with default `[]` directly as
  //
  // ```
  // return animalLists[name] || []
  // ```
  //
  // It causes an type error:
  // `Type 'Cat[] | Fish[] | undefined' is not assignable to type 'AnimalRecord[N][]'`

  // SOLUTION: Once `| undefined` cast, the above error can be avoided.
  // (But I haven't understood why.)
  const list: AnimalList<N> | undefined = animalLists[name]
  return list || []

  // MORE: To make a comparison, a complete map doesn't cause any error.
  //
  // ```
  // return idealCompleteAnimalLists[name]
  // ```
  //
  // The result seems to indicates that...
  // the type evaluation of `Partial` map with its key perform kind of strange.
}

// Case 2: Mapping Types to its Function
// -------------------------------------

type AnimalSoundPlayer<N extends AnimalName> = (animal: AnimalRecord[N]) => string
type AnimalSoundPlayers = { [N in AnimalName]: AnimalSoundPlayer<N>}

// Of cource, I don't define a complete map...
const animalSoundPlayers: Partial<AnimalSoundPlayers> = {
  Cat: cat => cat.meow
}

// ...but, yes, I define a default method. It resolves anything :)
const defaultAnimalSoundPlayer = (animal: AnyAnimal) => 'I am an animal'

// So, Let's define a gentle getter.
function getAnimalSoundPlayer<N extends AnimalName>(name: N): AnimalSoundPlayer<N> {

  // As case 1, directly return with default causes an type error.
  //
  // ```
  // return animalSoundPlayers[name] || defaultAnimalSoundPlayer
  // ```
  
  // PROBLEM: And case 1 solution doesn't resolve this case
  //
  // ```
  // const player: AnimalSoundPlayer<N> | undefined = animalSoundPlayers[name]
  // return player || defaultAnimalSoundPlayer
  // ```
  //
  // It brings another type error:
  // `Type 'AnimalSoundPlayer<"Cat"> | AnimalSoundPlayer<"Fish"> | undefined' is not assignable to type 'AnimalSoundPlayer<N>'.`
  // (There are more message stack in actual error)

  // SOLUTION: I haven't found yet
  const player: AnimalSoundPlayer<N> | undefined = animalSoundPlayers[name]
  return player || defaultAnimalSoundPlayer
}
