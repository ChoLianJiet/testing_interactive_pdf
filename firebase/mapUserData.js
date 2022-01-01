export const mapUserData = (user) => {
    const {uid, email, xa, displayName, photoUrl} = user
    console.log('map user data')
    console.log(user)
    return {
        id: uid,
        email,
        token: xa,
        name: displayName,
        profilePic: photoUrl,
    }
}