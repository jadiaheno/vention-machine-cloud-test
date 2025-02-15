export interface SpotifyTopResponse {
    items: Item[]
    total: number
    limit: number
    offset: number
    href: string
    next: string
    previous: string
}

interface Item {
    album: Album
    artists: Artist2[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalIds
    external_urls: ExternalUrls4
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
}

interface Album {
    album_type: string
    artists: Artist[]
    available_markets: string[]
    external_urls: ExternalUrls2
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}

interface Artist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}

interface ExternalUrls {
    spotify: string
}

interface ExternalUrls2 {
    spotify: string
}

interface Image {
    height: number
    url: string
    width: number
}

interface Artist2 {
    external_urls: ExternalUrls3
    href: string
    id: string
    name: string
    type: string
    uri: string
}

interface ExternalUrls3 {
    spotify: string
}

interface ExternalIds {
    isrc: string
}

interface ExternalUrls4 {
    spotify: string
}
