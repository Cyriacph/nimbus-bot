const CONDITIONS_DB = {
  blinded: "The character cannot see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
  bloodied: "The character has dropped to or below half their maximum hit points.",
  charmed: "The character cannot attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature.",
  dazed: "The character can move or take one action on their turn, not both. They cannot take bonus actions or reactions.",
  dying: "The character is unconscious and must make death saving throws at the start of their turns.",
  frightened: "The character has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature cannot willingly move closer to the source of its fear.",
  grappled: "The character's speed becomes 0, and they cannot benefit from any bonus to their speed.",
  restrained: "The character's speed becomes 0. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage. The creature has disadvantage on Dexterity saving throws.",
  hampered: "The character's speed is halved.",
  incapacitated: "The character cannot take actions or reactions.",
  invisible: "The character is impossible to see without the aid of magic or a special sense. Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.",
  petrified: "The character is transformed, along with any nonmagical object they are wearing or carrying, into a solid inanimate substance (usually stone).",
  poisoned: "The character has disadvantage on attack rolls and ability checks.",
  prone: "The character's only movement option is to crawl, until they stand up and thereby end the condition. They have disadvantage on attack rolls.",
  riding: "The character is mounted on a creature and moves with it.",
  slowed: "The character's speed is halved, they take a -2 penalty to AC and Dexterity saving throws, and they cannot use reactions.",
  taunted: "The character has disadvantage on attack rolls against creatures other than the one that taunted them.",
  wounded: "The character must make death saving throws with disadvantage."
};

module.exports = {
  CONDITIONS_DB,
};
