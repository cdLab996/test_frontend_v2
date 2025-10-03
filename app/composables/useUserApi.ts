import type { User } from '~/types/user'

class MockUserService {
  private storageKey = 'mock_users_data'
  
  private getUsers(): User[] {
    if (process.client) {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        return JSON.parse(data)
      }
      const initialData = this.getInitialData()
      this.saveUsers(initialData)
      return initialData
    }
    return this.getInitialData()
  }
  
  private saveUsers(users: User[]): void {
    if (process.client) {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
    }
  }
  
  private getInitialData(): User[] {
    return [
      { id: 1, name: '张三', age: 25 },
      { id: 2, name: '李四', age: 30 },
      { id: 3, name: '王五', age: 28 }
    ]
  }
  
  async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.getUsers()
  }
  
  async createUser(user: User): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const users = this.getUsers()
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1
    const newUser = { ...user, id: newId }
    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }
  
  async updateUser(id: number, user: User): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const users = this.getUsers()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }
    const updatedUser = { ...user, id }
    users[index] = updatedUser
    this.saveUsers(users)
    return updatedUser
  }
  
  async deleteUser(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const users = this.getUsers()
    const filtered = users.filter(u => u.id !== id)
    this.saveUsers(filtered)
  }
}

export const useUserApi = () => {
  const config = useRuntimeConfig()
  const { $axios } = useNuxtApp()
  
  const useMock = config.public.useMockData
  const mockService = new MockUserService()

  const getUsers = async (): Promise<User[]> => {
    if (useMock) {
      return mockService.getAllUsers()
    }
    const response = await $axios.get('/users')
    return response.data
  }

  const createUser = async (user: User): Promise<User> => {
    if (useMock) {
      return mockService.createUser(user)
    }
    const response = await $axios.post('/users', user)
    return response.data
  }

  const updateUser = async (id: number, user: User): Promise<User> => {
    if (useMock) {
      return mockService.updateUser(id, user)
    }
    const response = await $axios.put(`/users/${id}`, user)
    return response.data
  }

  const deleteUser = async (id: number): Promise<void> => {
    if (useMock) {
      return mockService.deleteUser(id)
    }
    await $axios.delete(`/users/${id}`)
  }

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
