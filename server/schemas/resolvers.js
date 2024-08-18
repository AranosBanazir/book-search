const {signToken, AuthenticationError} = require('../utils/auth')
const {User} = require('../models')
const resolvers = {
    Query:{
        me: async (parent, args, context)=>{
          if (context.user){
            const me = await User.findById(context.user._id)
            return me
          }
          throw AuthenticationError
        }
    },

    Mutation: {
        addUser: async (parent, {user}, context) =>{
            console.log(user)
            const newUser = User.create(user);
            const token = signToken(newUser);
            return { token, user: newUser };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
              throw AuthenticationError
            }
      
            const isCorrectPassword = user.isCorrectPassword(password)
      
            if (!isCorrectPassword) {
              throw AuthenticationError
            }
      
            const token = signToken(user)
            return { token, user }
          },
          saveBook: async (parent, { userId, book }, context) => {
            if (context.user) {
               User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { savedBooks: book } },
                {new: true, runValidators: true}
              );
              return book
            }
            throw AuthenticationError;
          },
          deleteBook: async (parent, {userId, book}, context) => {
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: userId },
                { $pull: { savedBooks: book } },
              );
            }
            throw AuthenticationError;
          },
        deleteUser: async (parent, args, context) =>{
            if (context.user){
              const user = await User.findByIdAndDelete(context.user_id)
              return user
            }
            throw AuthenticationError
        }
    }
}

module.exports = resolvers