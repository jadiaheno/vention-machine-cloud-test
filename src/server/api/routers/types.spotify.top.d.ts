export interface SpotifyTopResponse {
    items: Item[]
    total: number
    limit: number
    offset: number
    href: string
    next: string
    previous: string
}

export interface Item {
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

export interface Album {
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

export interface Artist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export interface ExternalUrls {
    spotify: string
}

export interface ExternalUrls2 {
    spotify: string
}

export interface Image {
    height: number
    url: string
    width: number
}

export interface Artist2 {
    external_urls: ExternalUrls3
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export interface ExternalUrls3 {
    spotify: string
}

export interface ExternalIds {
    isrc: string
}

export interface ExternalUrls4 {
    spotify: string
}
