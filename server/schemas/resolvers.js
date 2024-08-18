const { signToken, AuthenticationError } = require('../utils/auth')
const { User } = require('../models')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findById(context.user._id)
            }
            throw AuthenticationError
        }
    },
    Mutation: {
        addUser: async (parent, { user }) => {
        
           const newUser = await User.create(user)
      
            const token = signToken(user)
       
            return { token, newUser}
        },
        login: async (parent, { email, password }, context) => {
            const user = await User.findOne({ email })

            if (!user) throw AuthenticationError

            const isCorrectPassword = user.isCorrectPassword(password)
            if (!isCorrectPassword) throw AuthenticationError
            const token = signToken(user)
            return { token, user }
        },
        saveBook: async (parent, { book }, context ) => {
            if (context.user) {
               return User.findByIdAndUpdate(
                context.user._id,{
                  $addToSet: { savedBooks: book }
                },{ 
                  new: true,
                  runValidators: true 
                }
               )
            }
            throw AuthenticationError
        },
        removeBook: async (parent, { bookId }, context ) => {
            if (context.user) {
                return User.findByIdAndUpdate(
                 context.user._id,{
                     $pull: {savedBooks : { bookId } } 
                    }, 
                 { new: true }
                )
             }
             throw AuthenticationError
        }
    }
}



module.exports = resolvers