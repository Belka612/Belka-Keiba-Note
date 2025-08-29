export function calcAge(birth) {
  const today = new Date();
  let age = today.getFullYear() - birth.year;

  const hasBirthdayPassed =
    today.getMonth() + 1 > birth.month ||
    (today.getMonth() + 1 === birth.month && today.getDate() >= birth.day);

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}
