import { response, Router } from 'express'

const router = Router()

const users = []

function verifyUserExists(request, response, next) {
  const { cpf } = request.body

  const verifyCPF = users.some(user => user.cpf === cpf)

  if(verifyCPF) {
    return response.status(400).json({ Error: 'Already exists'})
  }

  next()  
}

function findUserByCPF(request, response, next) {
  const { cpf } = request.headers

  const getUser = users.find(user => user.cpf === cpf)

  if (!getUser) {
    return response.status(400).json({Error: 'User doesn`t exist'})
  }

  request.getUser = getUser

  next()  
}

router.get("/users", (request, response) => {
  return response.status(200).json(users)
})

router.post("/users", verifyUserExists, (request, response) => {
  const { name, cpf } = request.body

  const newUser = {
    name,
    cpf
  }

  users.push(newUser)

  return response.status(201).json({'New user': newUser})
})

router.get("/user", findUserByCPF, (request, response) => {
  const { getUser } = request

  return response.status(400).json(getUser)
})

router.put("/user", findUserByCPF, (request, response) => {
  const { getUser } = request
  const { name } = request.body

  getUser.name = name

  return response.status(201).json(getUser)
})

router.delete("/user", findUserByCPF, (request, response) => {
  const { getUser } = request

  users.splice(getUser, 1)

  return response.status(200).json(users)
})

export { router }