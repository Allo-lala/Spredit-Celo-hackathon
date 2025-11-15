"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { celoAlfajores } from "wagmi/chains"
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Users, TrendingUp, Activity, Target, Zap } from "lucide-react"
import Link from "next/link"

// Mock games data - In production, this would come from an API
const mockGames = {
  soccer: [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      date: "2024-01-15",
      time: "15:00",
      league: "Premier League",
      status: "upcoming"
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      date: "2024-01-16",
      time: "20:00",
      league: "La Liga",
      status: "upcoming"
    },
    {
      id: 3,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      date: "2024-01-17",
      time: "17:30",
      league: "Premier League",
      status: "upcoming"
    }
  ],
  rugby: [
    {
      id: 4,
      homeTeam: "All Blacks",
      awayTeam: "Springboks",
      date: "2024-01-18",
      time: "14:00",
      league: "International",
      status: "upcoming"
    },
    {
      id: 5,
      homeTeam: "England",
      awayTeam: "France",
      date: "2024-01-19",
      time: "16:00",
      league: "Six Nations",
      status: "upcoming"
    }
  ],
  basketball: [
    {
      id: 6,
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      date: "2024-01-20",
      time: "22:00",
      league: "NBA",
      status: "upcoming"
    },
    {
      id: 7,
      homeTeam: "Celtics",
      awayTeam: "Heat",
      date: "2024-01-21",
      time: "20:30",
      league: "NBA",
      status: "upcoming"
    }
  ]
}

function HomeContent() {
  const { address, isConnected, chain } = useAccount()
  const [selectedSport, setSelectedSport] = useState<"soccer" | "rugby" | "basketball">("soccer")

  const isWrongNetwork = isConnected && chain?.id !== celoAlfajores.id

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              <Trophy className="h-4 w-4" />
              Spredit - Sports Prediction on Celo
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Predict. Win. <span className="text-primary">Earn.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect your wallet and predict the outcomes of upcoming sports matches. 
              Win rewards when your predictions are correct!
            </p>
            {!isConnected && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="w-full sm:w-auto">
                  <Wallet>
                    <Connect label="Connect Wallet to Start">
                      <div className="flex items-center gap-2">
                        <Avatar />
                        <Name isTruncated />
                      </div>
                    </Connect>
                  </Wallet>
                </div>
              </div>
            )}
            {isConnected && isWrongNetwork && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please switch to Celo Alfajores testnet to make predictions
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Games Section */}
      {isConnected && !isWrongNetwork && (
        <section className="py-12 lg:py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Games</h2>
              <p className="text-muted-foreground">Select a sport and make your predictions</p>
            </div>

            <Tabs value={selectedSport} onValueChange={(v) => setSelectedSport(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="soccer" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Soccer
                </TabsTrigger>
                <TabsTrigger value="rugby" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Rugby
                </TabsTrigger>
                <TabsTrigger value="basketball" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Basketball
                </TabsTrigger>
              </TabsList>

              {(["soccer", "rugby", "basketball"] as const).map((sport) => (
                <TabsContent key={sport} value={sport} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockGames[sport].map((game) => (
                      <Card key={game.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{game.league}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {game.date}
                            </div>
                          </div>
                          <CardTitle className="text-xl">{game.homeTeam} vs {game.awayTeam}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <span>{game.time}</span>
                            <span>•</span>
                            <span className="capitalize">{game.status}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Link href={`/predict/${game.id}`}>
                            <Button className="w-full" size="lg">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Make Prediction
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {isConnected && !isWrongNetwork && (
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Active Predictions</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground mt-1">Your pending predictions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Win Rate</CardTitle>
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground mt-1">Start predicting to see your stats</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Total Earnings</CardTitle>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0 cUSD</div>
                  <p className="text-sm text-muted-foreground mt-1">Rewards from correct predictions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Connect Wallet CTA */}
      {!isConnected && (
        <section className="py-12 lg:py-16">
          <div className="container px-4 mx-auto max-w-4xl">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Ready to Start Predicting?</CardTitle>
                <CardDescription>
                  Connect your wallet to start making predictions on upcoming games
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Wallet>
                  <Connect label="Connect Wallet">
                    <div className="flex items-center gap-2">
                      <Avatar />
                      <Name isTruncated />
                    </div>
                  </Connect>
                </Wallet>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </main>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="flex-1">
        <section className="relative py-12 lg:py-20">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Spredit</h1>
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return <HomeContent />
}
