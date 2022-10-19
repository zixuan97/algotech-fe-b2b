export const toCurrencyString = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

export const redirectToExternal = (url: string) => {
  const link = window.document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  link.remove();
};

export const interleave = <T>(
  arr: T[],
  thing: T,
  limit: number = Number.MAX_VALUE
) => arr.flatMap((x, index) => (index > 0 && index <= limit ? [thing, x] : x));
