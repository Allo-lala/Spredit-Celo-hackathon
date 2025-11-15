"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { celoAlfajores } from "wagmi/chains"
import { useParams, useRouter } from "next/navigation"
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Trophy, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Mock game data - In production, this would come from an API
const getGameById = (id: string) => {
  const allGames = [
    { id: 1, homeTeam: "Manchester United", awayTeam: "Liverpool", date: "2024-01-15", time: "15:00", league: "Premier League", sport: "soccer" },
    { id: 2, homeTeam: "Barcelona", awayTeam: "Real Madrid", date: "2024-01-16", time: "20:00", league: "La Liga", sport: "soccer" },
    { id: 3, homeTeam: "Arsenal", awayTeam: "Chelsea", date: "2024-01-17", time: "17:30", league: "Premier League", sport: "soccer" },
    { id: 4, homeTeam: "All Blacks", awayTeam: "Springboks", date: "2024-01-18", time: "14:00", league: "International", sport: "rugby" },
    { id: 5, homeTeam: "England", awayTeam: "France", date: "2024-01-19", time: "16:00", league: "Six Nations", sport: "rugby" },
    { id: 6, homeTeam: "Lakers", awayTeam: "Warriors", date: "2024-01-20", time: "22:00", league: "NBA", sport: "basketball" },
    { id: 7, homeTeam: "Celtics", awayTeam: "Heat", date: "2024-01-21", time: "20:30", league: "NBA", sport: "basketball" },
  ]
  return allGames.find(g => g.id === parseInt(id))
}

function PredictionContent() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected, chain } = useAccount()
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away" | null>(null)
  const [amount, setAmount] = useState("")
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: celoAlfajores.id,
  })

  const game = getGameById(params.id as string)
  const isWrongNetwork = isConnected && chain?.id !== celoAlfajores.id

  if (!game) {
    return (
      <div className="container px-4 mx-auto max-w-4xl py-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">Game not found</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePrediction = () => {
    if (!selectedTeam || !amount || !isConnected) return
    
    // TODO: Implement actual contract call
    // For now, just simulate
    console.log("Predicting:", { game: game.id, team: selectedTeam, amount })
    
    // In production, this would call the prediction contract
    // writeContract({
    //   address: PREDICTION_CONTRACT_ADDRESS,
    //   abi: PREDICTION_ABI,
    //   functionName: "makePrediction",
    //   args: [game.id, selectedTeam === "home" ? 0 : 1, parseUnits(amount, 18)],
    //   chainId: celoAlfajores.id,
    // })
  }

  return (
    <div className="container px-4 mx-auto max-w-4xl py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
      </Link>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to make predictions</CardDescription>
          </CardHeader>
          <CardContent>
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
      ) : isWrongNetwork ? (
        <Card>
          <CardHeader>
            <CardTitle>Wrong Network</CardTitle>
            <CardDescription>Please switch to Celo Alfajores testnet</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Game Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{game.league}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {game.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {game.time}
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl">{game.homeTeam} vs {game.awayTeam}</CardTitle>
            </CardHeader>
          </Card>

          {/* Prediction Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Make Your Prediction
              </CardTitle>
              <CardDescription>Select which team you think will win</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedTeam("home")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedTeam === "home"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{game.homeTeam}</div>
                    <div className="text-sm text-muted-foreground">Home Team</div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedTeam("away")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedTeam === "away"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{game.awayTeam}</div>
                    <div className="text-sm text-muted-foreground">Away Team</div>
                  </div>
                </button>
              </div>

              {/* Amount Input */}
              {selectedTeam && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stake Amount (cUSD)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum stake: 1 cUSD
                  </p>
                </div>
              )}

              {/* Submit Button */}
              {selectedTeam && amount && (
                <Button
                  onClick={handlePrediction}
                  disabled={isPending || isConfirming || !amount || parseFloat(amount) < 1}
                  className="w-full"
                  size="lg"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isPending ? "Confirming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-4 w-4" />
                      Submit Prediction
                    </>
                  )}
                </Button>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error.message}
                </div>
              )}

              {isConfirmed && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Prediction submitted successfully!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default function PredictionPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container px-4 mx-auto max-w-4xl py-12">Loading...</div>
  }

  return <PredictionContent />
}

