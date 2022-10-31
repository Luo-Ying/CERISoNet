
export interface comment {
    idAuthor: number;
    date: string;
    hour: string;
    text: string;
}

export interface image {
    title: string;
    url: string;
}

export interface post {
    _id: number;
    body: string;
    comments: Array<comment>;
    createdBy: number;
    date: string;
    hashtags: Array<string>;
    hour: string;
    images: image;
    likes: 5;
}