import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "./App.css";

const App = () => {
  const [wordFrequency, setWordFrequency] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wordFrequency.length > 0) {
      plotHistogram();
    }
  }, [wordFrequency]);

  const fetchWordFrequency = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://www.terriblytinytales.com/test.txt"
      );
      const text = await response.text();
      const words = text.toLowerCase().match(/\b\w+\b/g);

      if (words) {
        const frequencyMap = words.reduce((map, word) => {
          map[word] = (map[word] || 0) + 1;
          return map;
        }, {});

        const sortedFrequency = Object.entries(frequencyMap).sort(
          (a, b) => b[1] - a[1]
        );
        const top20Words = sortedFrequency.slice(0, 20);

        setWordFrequency(top20Words);
      } else {
        setWordFrequency([]);
      }
    } catch (error) {
      console.error("Error fetching word frequency:", error);
    }

    setIsLoading(false);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      wordFrequency.map((row) => row.join(",")).join("\n");
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "word_count.csv");
    document.body.appendChild(link);
    link.click();
  };

  const plotHistogram = () => {
    const ctx = document.getElementById("histogram").getContext("2d");

    const labels = wordFrequency.map(([word]) => word);
    const data = wordFrequency.map(([_, frequency]) => frequency);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Word Frequency",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      }
    });
  };

  return (
    <div>
      <div className="info">
        <p> Done by - Vivek Kumar </p>
      </div>
      <button
        className="button"
        onClick={fetchWordFrequency}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>

      {wordFrequency.length > 0 && (
        <>
          <h2>Word Frequency Count Histogram from Webpage</h2>
          <canvas id="histogram"></canvas>
          <button className="button" onClick={exportToCSV}>
            Export
          </button>
        </>
      )}
      <br />
      <br />
    </div>
  );
};

export default App;
