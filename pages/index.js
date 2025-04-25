import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const initialData = [
  { date: "01.05", mario: 0, sonic: 0 },
  { date: "02.05", mario: 0, sonic: 0 },
  { date: "03.05", mario: 0, sonic: 0 },
  { date: "04.05", mario: 0, sonic: 0 },
  { date: "05.05", mario: 0, sonic: 0 },
  { date: "06.05", mario: 0, sonic: 0 },
  { date: "07.05", mario: 0, sonic: 0 }
];

const coinSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-changing-tab-206.wav");

export default function TelefonBattleDashboard() {
  const [data, setData] = useState(initialData);
  const [highscore, setHighscore] = useState({ character: "", score: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleChange = (index, character, value) => {
    const newData = [...data];
    newData[index][character] = parseInt(value) || 0;
    setData(newData);
    coinSound.play();
  };

  useEffect(() => {
    const isGameOver = data.every(entry => entry.mario > 0 || entry.sonic > 0);
    setGameOver(isGameOver);

    let marioTotal = data.reduce((sum, d) => sum + d.mario, 0);
    let sonicTotal = data.reduce((sum, d) => sum + d.sonic, 0);
    if (marioTotal > sonicTotal) {
      setHighscore({ character: "Mario", score: marioTotal });
    } else if (sonicTotal > marioTotal) {
      setHighscore({ character: "Sonic", score: sonicTotal });
    } else {
      setHighscore({ character: "Unentschieden", score: marioTotal });
    }
  }, [data]);

  return (
    <div className="p-4 font-mono bg-black text-green-400 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-yellow-300 animate-pulse">Retro Call Battle: Mario vs Sonic</h1>

      <div className="mb-4 px-4 py-2 bg-yellow-300 text-black font-bold text-center rounded-xl animate-bounce shadow-md w-fit mx-auto">
        Highscore Leader: {highscore.character} mit {highscore.score} Punkten
      </div>

      {gameOver && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 z-50 text-center">
          <h2 className="text-6xl font-bold text-red-500 mb-6 animate-pulse">GAME OVER</h2>
          <p className="text-3xl text-green-400">Sieger: <span className="text-yellow-300">{highscore.character}</span></p>
          <p className="text-xl mt-2">Total Points: {highscore.score}</p>
        </div>
      )}

      <Tabs defaultValue="inputs">
        <TabsList>
          <TabsTrigger value="inputs">Score Input</TabsTrigger>
          <TabsTrigger value="stats">Arcade Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((entry, index) => (
              <Card key={index} className="bg-gray-900 text-green-400 border border-yellow-500">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">Day {entry.date}</h2>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Mario Score"
                      value={entry.mario}
                      onChange={(e) => handleChange(index, "mario", e.target.value)}
                      className="bg-black text-green-400 border-yellow-500"
                    />
                    <Input
                      type="number"
                      placeholder="Sonic Score"
                      value={entry.sonic}
                      onChange={(e) => handleChange(index, "sonic", e.target.value)}
                      className="bg-black text-green-400 border-yellow-500"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <BarChart width={600} height={300} data={data} className="mx-auto">
            <XAxis dataKey="date" stroke="#facc15" />
            <YAxis stroke="#facc15" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#facc15' }} />
            <Legend wrapperStyle={{ color: '#facc15' }} />
            <Bar dataKey="mario" name="Mario" fill="#f87171" />
            <Bar dataKey="sonic" name="Sonic" fill="#60a5fa" />
          </BarChart>
        </TabsContent>
      </Tabs>
    </div>
  );
}
