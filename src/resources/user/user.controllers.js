import { User } from './user.model'

export const me = (req, res) => {
  const user = {
    name: req.user.name,
    email: req.user.email,
    profileImageURL: req.user.profileImageURL
  }
  res.status(200).json({ data: user })
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
