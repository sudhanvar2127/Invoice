import React from 'react';

// Words for numbers
const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

// Convert numbers from 0 to 99 into words
function twoDigitsToWords(num) {
  if (num === 0) return 'Zero';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
}

// Convert numbers from 0 to 999 into words
function threeDigitsToWords(num) {
  let word = '';
  if (num >= 100) {
    word += units[Math.floor(num / 100)] + ' Hundred';
    num = num % 100;
    if (num > 0) {
      word += ' and ';
    }
  }
  if (num > 0) {
    word += twoDigitsToWords(num);
  }
  return word.trim();
}

// Convert number to words up to 999999 (thousands and hundreds)
function numberToWords(number) {
  if (number === 0) return 'Zero';
  let words = '';

  if (number > 999) {
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;

    words += threeDigitsToWords(thousands) + ' Thousand';
    if (remainder > 0) {
      // If remainder < 100, add 'and' for natural reading
      words += (remainder < 100 ? ' and ' : ' ') + threeDigitsToWords(remainder);
    }
  } else {
    words = threeDigitsToWords(number);
  }

  return words.trim();
}

function convertAmountToWords(amount) {
  const [rupeesPart, paisaPartRaw] = amount.toString().split('.');

  const rupees = parseInt(rupeesPart, 10);
  const paisaPart = paisaPartRaw ? paisaPartRaw.padEnd(2, '0').slice(0, 2) : '00';
  const paisa = parseInt(paisaPart, 10);

  let words = '';

  words += numberToWords(rupees) + ' Rupees';

  // Always show paisa, even if zero
  words += ' and ' + twoDigitsToWords(paisa) + ' Paisa';

  words += ' only';

  return words;
}

export default function NumberToWords({ number }) {
  const words = convertAmountToWords(number);
  return <div className=''>{words}</div>;
}