"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

function LeaderboardContent() {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, address: "0x1234...5678", wins: 45, totalPredictions: 60, earnings: "1250.50" },
    { rank: 2, address: "0x2345...6789", wins: 38, totalPredictions: 55, earnings: "980.25" },
    { rank: 3, address: "0x3456...7890", wins: 32, totalPredictions: 48, earnings: "750.00" },
  ]

  return (
    <div className="container px-4 mx-auto max-w-6xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top predictors on Spredit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Predictors
          </CardTitle>
          <CardDescription>Ranked by total earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    {user.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {user.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                    {user.rank === 3 && <Award className="h-5 w-5 text-amber-600" />}
                    {user.rank > 3 && <span className="font-bold">#{user.rank}</span>}
                  </div>
                  <div>
                    <div className="font-semibold">{user.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.wins}/{user.totalPredictions} correct
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{user.earnings} cUSD</div>
                  <Badge variant="secondary" className="mt-1">
                    {Math.round((user.wins / user.totalPredictions) * 100)}% win rate
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="container px-4 mx-auto max-w-6xl py-12">Loading...</div>

  return <LeaderboardContent />
}

