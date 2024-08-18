import { gql } from '@apollo/client'


export const ADD_USER = gql`
    mutation addUser($user: UserInput!) {
        addUser(user: $user) {
            token
            user {
            email
            _id
                savedBooks {
                    title
                }
            }
        }
    }
`

export const LOGIN = gql`
    mutation login($email: String!, $password: String!,) {
        login(email: $email, password: $password) {
            token
            user {
                email
                username
            }
        }
    }
`


export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
           email
            username
            savedBooks {
                title
            }
        }
    }

`


export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            email
            username
            savedBooks {
                title
            }
        }
    }
`