import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAppStore = defineStore('app', () => {
  const users = ref<User[]>([])

  const setUsers = (newUsers: User[]) => {
    users.value = newUsers
  }

  const addUser = (user: User) => {
    users.value.push(user)
  }

  const updateUser = (id: number, updatedUser: User) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...updatedUser, id }
    }
  }

  const deleteUser = (id: number) => {
    users.value = users.value.filter(u => u.id !== id)
  }

  return {
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser
  }
})
