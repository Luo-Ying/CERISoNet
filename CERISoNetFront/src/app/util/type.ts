export interface comment {
    commentedBy: number;
    date: string;
    hour: string;
    text: string;
}

export interface image {
    title: string;
    url: string;
}

export interface post {
    Shared: number;
    _id: number;
    body: string;
    comments: Array<comment>;
    createdBy: number;
    date: string;
    hashtags: Array<string>;
    hour: string;
    images: image;
    likes: number;
    likedby: Array<number>;
    author: author;
}

export interface author {
    id: number;
    avatar: string;
    identifiant: string;
    nom: string;
    prenom: string;
    status_connexion: number;
}

export interface user {
    id: number;
    avatar: string;
    identifiant: string;
    nom: string;
    prenom: string;
    status_connexion: number;
}