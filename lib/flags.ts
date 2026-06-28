const FLAGS: Record<string, string> = {
  Argentina: "🇦🇷", Brazil: "🇧🇷", France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain: "🇪🇸",
  Germany: "🇩🇪", Portugal: "🇵🇹", Netherlands: "🇳🇱", Belgium: "🇧🇪", Italy: "🇮🇹",
  Croatia: "🇭🇷", Uruguay: "🇺🇾", Colombia: "🇨🇴", Mexico: "🇲🇽", USA: "🇺🇸",
  "United States": "🇺🇸", Canada: "🇨🇦", Morocco: "🇲🇦", Japan: "🇯🇵", "South Korea": "🇰🇷",
  Switzerland: "🇨🇭", Senegal: "🇸🇳", Ecuador: "🇪🇨", Ghana: "🇬🇭", Poland: "🇵🇱",
  Serbia: "🇷🇸", Denmark: "🇩🇰", Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", Tunisia: "🇹🇳", Cameroon: "🇨🇲",
  Australia: "🇦🇺", "Costa Rica": "🇨🇷", Iran: "🇮🇷", "Saudi Arabia": "🇸🇦", Qatar: "🇶🇦",
  Ukraine: "🇺🇦", Sweden: "🇸🇪", Austria: "🇦🇹", Norway: "🇳🇴", Turkey: "🇹🇷",
  "Ivory Coast": "🇨🇮", Nigeria: "🇳🇬", Egypt: "🇪🇬", Algeria: "🇩🇿", Panama: "🇵🇦",
  Jamaica: "🇯🇲", "New Zealand": "🇳🇿", "Czech Republic": "🇨🇿", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Slovakia: "🇸🇰", Hungary: "🇭🇺", Paraguay: "🇵🇾", Chile: "🇨🇱", Peru: "🇵🇪",
  Bolivia: "🇧🇴", Venezuela: "🇻🇪", "Republic of Ireland": "🇮🇪", Finland: "🇫🇮",
  "South Africa": "🇿🇦", "DR Congo": "🇨🇩", "Bosnia and Herzegovina": "🇧🇦", "Cabo Verde": "🇨🇻",
};

export function flagFor(team: string | null): string {
  if (!team) return "🏳️";
  return FLAGS[team] ?? "🏳️";
}
