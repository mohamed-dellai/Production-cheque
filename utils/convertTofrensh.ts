export function convertAmountToFrench(amount: Number): string {
    // Convert the number to a string and split on the decimal separator.
    const parts = amount.toString().split(".");
    const dinars = parseInt(parts[0], 10);
    // Use the full fractional part if present (or empty string if not).
    const millimesStr = parts[1] || "";
  
    // Converts numbers less than 100 into French words.
    function convertNN(n: number): string|undefined {
      const ones = [
        "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
        "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
        "quinze", "seize"
      ];
      if (n < 17) {
        return ones[n];
      } else if (n < 20) {
        return "dix-" + ones[n - 10];
      } else if (n < 70) {
        const tensWords = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];
        const ten = Math.floor(n / 10);
        const unit = n % 10;
        if (unit === 1) {
          return tensWords[ten] + " et un";
        } else if (unit > 0) {
          return tensWords[ten] + "-" + ones[unit];
        } else {
          return tensWords[ten];
        }
      } else if (n < 80) {
        // 70 to 79: soixante + (10 to 19)
        if (n === 71) {
          return "soixante et onze";
        } else {
          return "soixante-" + convertNN(n - 60);
        }
      } else if (n < 100) {
        // 80 to 99: 80 is "quatre-vingts" if no remainder, otherwise "quatre-vingt" + remainder.
        if (n === 80) {
          return "quatre-vingts";
        } else {
          return "quatre-vingt-" + convertNN(n - 80);
        }
      }
    }
  
    // Converts numbers less than 1000.
    function convertHundred(n: number): string|undefined {
      if (n < 100) {
        return convertNN(n);
      } else {
        const hundred = Math.floor(n / 100);
        const remainder = n % 100;
        let hundredWord = (hundred === 1) ? "cent" : convertNN(hundred) + " cent";
        // Add an "s" to "cent" only if there's no remainder and hundred > 1.
        if (remainder === 0) {
          if (hundred > 1) {
            hundredWord += "s";
          }
          return hundredWord;
        } else {
          return hundredWord + " " + convertNN(remainder);
        }
      }
    }
  
    // Converts any non-negative integer into French words.
    function convertNumber(n: number): string|undefined {
      if (n < 1000) {
        return convertHundred(n);
      } else if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        let thousandsWord = (thousands === 1) ? "mille" : convertHundred(thousands) + " mille";
        if (remainder) {
          return thousandsWord + " " + convertHundred(remainder);
        } else {
          return thousandsWord;
        }
      } else {
        // Handle numbers in the millions.
        const millions = Math.floor(n / 1000000);
        const remainder = n % 1000000;
        let millionsWord = (millions === 1) ? "un million" : convertNumber(millions) + " millions";
        if (remainder) {
          return millionsWord + " " + convertNumber(remainder);
        } else {
          return millionsWord;
        }
      }
    }
  
    // Convert the dinar part.
    let dinarsWord = convertNumber(dinars) + (dinars > 1 ? " dinars" : " dinar");
  
    // Append the millime part if any.
    if (millimesStr !== "") {
      // Use the full string of millimes; note: no conversion to a number here.
      const millimeLabel = (millimesStr === "1") ? " millime" : " millimes";
      return dinarsWord + " et " + millimesStr + millimeLabel;
    } else {
      return dinarsWord;
    }
  }
