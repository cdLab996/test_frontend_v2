<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="fixed top-4 right-4 z-50 flex items-center gap-2 md:gap-3">
      <LanguageSwitcher />
      
      <div v-if="config.public.useMockData" class="bg-yellow-500 text-black px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 text-xs md:text-base">
        <span>testEnv</span>
      </div>
    </div>

    <div class="max-w-5xl mx-auto pt-12 md:pt-0">
      <div class="bg-gray-800 rounded-lg p-4 md:p-8 mb-6 md:mb-8 border border-gray-700">
        <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">{{ $t('operation') }}</h2>
        
        <div class="space-y-3 md:space-y-4">
          <ETextField
            v-model="form.name"
            :label="$t('name')"
            :placeholder="$t('name')"
          />
          
          <ETextField
            v-model="form.age"
            :label="$t('age')"
            :placeholder="$t('age')"
            type="number"
          />

          <div class="flex justify-end gap-2 md:gap-4 pt-2 md:pt-4">
            <EBtn 
              :text="$t('edit')"
              color="success"
              @click="handleEdit"
              class="flex-1 md:flex-none"
            />
            <EBtn 
              :text="$t('add')"
              color="warn"
              @click="handleAdd"
              class="flex-1 md:flex-none"
            />
          </div>
        </div>
      </div>

      <div class="md:hidden space-y-3">
        <div 
          v-for="(user, index) in store.users" 
          :key="user.id"
          class="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-gray-400 text-sm">#{{ index + 1 }}</span>
                <span class="font-semibold text-lg">{{ user.name }}</span>
              </div>
              <div class="text-gray-400 text-sm">
                {{ $t('age') }}: <span class="text-white">{{ user.age }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2 pt-2 border-t border-gray-700">
            <EBtn 
              :text="$t('edit')"
              color="success"
              @click="selectUser(user)"
              class="flex-1"
            />
            <EBtn 
              :text="$t('delete')"
              color="error"
              @click="handleDelete(user.id!)"
              class="flex-1"
            />
          </div>
        </div>
        
        <div v-if="store.users.length === 0" class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-400">
          暂无数据
        </div>
      </div>

      <div class="hidden md:block bg-gray-800 rounded-lg p-8 border border-gray-700 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-4 px-2 text-center">#</th>
              <th class="py-4 px-2 text-center">{{ $t('name') }}</th>
              <th class="py-4 px-2 text-center">{{ $t('age') }}</th>
              <th class="py-4 px-2 text-center">{{ $t('operation') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(user, index) in store.users" 
              :key="user.id"
              class="border-b border-gray-700 last:border-0"
            >
              <td class="py-4 px-2 text-center">{{ index + 1 }}</td>
              <td class="py-4 px-2 text-center">{{ user.name }}</td>
              <td class="py-4 px-2 text-center">{{ user.age }}</td>
              <td class="py-4 px-2 text-center">
                <div class="flex justify-center gap-2">
                  <EBtn 
                    :text="$t('edit')"
                    color="success"
                    @click="selectUser(user)"
                  />
                  <EBtn 
                    :text="$t('delete')"
                    color="error"
                    @click="handleDelete(user.id!)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <dialog ref="confirmDialog" class="rounded-lg bg-gray-800 text-white p-4 md:p-6 backdrop:bg-black/50 max-w-[90vw] md:max-w-none">
      <div class="min-w-[240px] md:min-w-[280px]">
        <p class="mb-4 md:mb-6 text-center text-sm md:text-base">{{ confirmMessage }}</p>
        <div class="flex justify-center gap-2 md:gap-4">
          <EBtn 
            :text="$t('cancel')"
            color="error"
            @click="closeDialog"
            class="flex-1 md:flex-none"
          />
          <EBtn 
            :text="$t('confirm')"
            color="success"
            @click="confirmAction"
            class="flex-1 md:flex-none"
          />
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '~/store/app'
import type { User } from '~/types/user'

const { t } = useI18n()
const store = useAppStore()
const userApi = useUserApi()
const config = useRuntimeConfig()

const { data: initialUsers } = await useAsyncData('users', () => userApi.getUsers())
if (initialUsers.value) {
  store.setUsers(initialUsers.value)
}

const form = reactive<{ name: string; age: string | number; editingId?: number }>({
  name: '',
  age: ''
})

const confirmDialog = ref<HTMLDialogElement>()
const confirmMessage = ref('')
let pendingAction: (() => void) | null = null

// 验证表单
const validateForm = (): boolean => {
  if (!form.name.trim()) {
    alert(t('nameRequired'))
    return false
  }
  if (!form.age || Number(form.age) <= 0) {
    alert(t('ageRequired'))
    return false
  }
  return true
}

const selectUser = (user: User) => {
  form.name = user.name
  form.age = user.age
  form.editingId = user.id
  if (window.innerWidth < 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const showConfirmDialog = (message: string, action: () => void) => {
  confirmMessage.value = message
  pendingAction = action
  confirmDialog.value?.showModal()
}

const closeDialog = () => {
  confirmDialog.value?.close()
  pendingAction = null
}

const confirmAction = () => {
  if (pendingAction) {
    pendingAction()
  }
  closeDialog()
}

const handleAdd = () => {
  if (!validateForm()) return
  
  showConfirmDialog(t('confirmAdd'), async () => {
    try {
      const newUser: User = {
        name: form.name,
        age: Number(form.age)
      }
      const created = await userApi.createUser(newUser)
      store.addUser(created)
      resetForm()
    } catch (error) {
      alert(t('error'))
    }
  })
}

const handleEdit = () => {
  if (!form.editingId) {
    alert(t('error'))
    return
  }
  if (!validateForm()) return
  
  showConfirmDialog(t('confirmEdit'), async () => {
    try {
      const updatedUser: User = {
        name: form.name,
        age: Number(form.age)
      }
      await userApi.updateUser(form.editingId!, updatedUser)
      store.updateUser(form.editingId!, updatedUser)
      resetForm()
    } catch (error) {
      alert(t('error'))
    }
  })
}

const handleDelete = (id: number) => {
  showConfirmDialog(t('confirmDelete'), async () => {
    try {
      await userApi.deleteUser(id)
      store.deleteUser(id)
    } catch (error) {
      alert(t('error'))
    }
  })
}

const resetForm = () => {
  form.name = ''
  form.age = ''
  form.editingId = undefined
}
</script>

<style scoped lang="scss">
dialog {
  border: 1px solid #374151;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
