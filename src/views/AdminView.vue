<template>
    <v-app>
        <v-main style="background: linear-gradient(135deg, #f5f0eb 0%, #ede0d4 100%); min-height: 100vh;">
            <v-container class="py-8">

                <!-- Login -->
                <v-row v-if="!autenticado" justify="center" align="center" style="min-height: 90vh;">
                    <v-col cols="12" sm="8" md="4">
                        <v-card elevation="8" rounded="xl" class="pa-8">
                            <div class="text-center mb-6">
                                <div style="font-size: 2.5rem;">💍</div>
                                <div style="font-family: 'Georgia', serif; font-size: 1.5rem; color: #7c5c3e;">
                                    Emanuela & Gilberto
                                </div>
                                <div style="color: #aaa; font-size: 0.9rem; margin-top: 4px;">Área de Administração
                                </div>
                            </div>

                            <v-text-field v-model="senha" label="Password" type="password" prepend-inner-icon="mdi-lock"
                                variant="outlined" rounded color="#7c5c3e" class="mb-3" @keyup.enter="autenticar" />

                            <v-alert v-if="erroLogin" type="error" variant="tonal" rounded="lg" class="mb-4">
                                Password incorreta.
                            </v-alert>

                            <v-btn block size="large" rounded="xl" style="background: #7c5c3e; color: white;"
                                @click="autenticar">
                                Entrar
                            </v-btn>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Painel Admin -->
                <div v-else>

                    <!-- Header -->
                    <v-row align="center" class="mb-6">
                        <v-col>
                            <div style="font-family: 'Georgia', serif; font-size: 1.6rem; color: #7c5c3e;">
                                💍 Emanuela & Gilberto
                            </div>
                            <div style="color: #aaa; font-size: 0.9rem;">Painel de respostas</div>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn variant="outlined" color="#7c5c3e" rounded="xl" @click="autenticado = false">
                                <v-icon start>mdi-logout</v-icon>
                                Sair
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- Estatísticas -->
                    <v-row class="mb-6">
                        <v-col cols="12" sm="4">
                            <v-card rounded="xl" elevation="4" class="pa-5 text-center" style="background: #7c5c3e;">
                                <v-icon size="32" color="white" class="mb-2">mdi-account-group</v-icon>
                                <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ respostas.length }}
                                </div>
                                <div style="color: #f0e0cc; font-size: 0.9rem;">Respostas recebidas</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-card rounded="xl" elevation="4" class="pa-5 text-center" style="background: #2e7d32;">
                                <v-icon size="32" color="white" class="mb-2">mdi-check-circle</v-icon>
                                <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ confirmados }}</div>
                                <div style="color: #c8e6c9; font-size: 0.9rem;">Presenças confirmadas</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-card rounded="xl" elevation="4" class="pa-5 text-center" style="background: #c62828;">
                                <v-icon size="32" color="white" class="mb-2">mdi-close-circle</v-icon>
                                <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ recusados }}</div>
                                <div style="color: #ffcdd2; font-size: 0.9rem;">Não comparecem</div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Tabela -->
                    <v-card rounded="xl" elevation="4">
                        <v-card-title class="pa-5 pb-0" style="color: #7c5c3e; font-family: Georgia, serif;">
                            <v-icon color="#7c5c3e" class="mr-2">mdi-format-list-bulleted</v-icon>
                            Lista de respostas
                        </v-card-title>

                        <v-card-text class="pa-4">
                            <v-text-field v-model="pesquisa" label="Pesquisar..." prepend-inner-icon="mdi-magnify"
                                variant="outlined" rounded density="compact" color="#7c5c3e" class="mb-4" clearable />

                            <v-data-table :headers="headers" :items="respostas" :search="pesquisa" :items-per-page="10"
                                rounded="xl">
                                <template #item.confirmado="{ item }">
                                    <v-chip :color="item.confirmado ? 'green' : 'red'" variant="tonal" rounded="xl"
                                        size="small">
                                        <v-icon start size="small">{{ item.confirmado ? 'mdi-check' : 'mdi-close'
                                            }}</v-icon>
                                        {{ item.confirmado ? 'Confirmado' : 'Não vai' }}
                                    </v-chip>
                                </template>
                                <template #item.nome_parceiro="{ item }">
                                    <span v-if="item.nome_parceiro">
                                        <v-icon size="small" color="#c9a96e">mdi-account-heart</v-icon>
                                        {{ item.nome_parceiro }}
                                    </span>
                                    <span v-else style="color: #ccc;">—</span>
                                </template>
                                <template #item.criado_em="{ item }">
                                    <span style="color: #888; font-size: 0.85rem;">
                                        {{ new Date(item.criado_em).toLocaleDateString('pt-PT') }}
                                    </span>
                                </template>
                                <template #item.contacto="{ item }">
                                    <a v-if="item.contacto" :href="`tel:${item.contacto}`"
                                        style="color: #7c5c3e; text-decoration: none;">
                                        <v-icon size="small" class="mr-1">mdi-phone</v-icon>{{ item.contacto }}
                                    </a>
                                    <span v-else style="color: #ccc;">—</span>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </div>

            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

const autenticado = ref(false)
const senha = ref('')
const erroLogin = ref(false)
const respostas = ref([])
const pesquisa = ref('')

const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Parceiro/a', key: 'nome_parceiro' },
    { title: 'Contacto', key: 'contacto' },
    { title: 'Presença', key: 'confirmado' },
    { title: 'Data', key: 'criado_em' }
]

function autenticar() {
    if (senha.value === import.meta.env.VITE_ADMIN_PASSWORD) {
        autenticado.value = true
        carregarRespostas()
    } else {
        erroLogin.value = true
    }
}

async function carregarRespostas() {
    const { data } = await supabase
        .from('respostas')
        .select('*')
        .order('criado_em', { ascending: false })
    respostas.value = data || []
}

const confirmados = computed(() =>
    respostas.value
        .filter(r => r.confirmado)
        .reduce((total, r) => total + (r.nome_parceiro ? 2 : 1), 0)
)

const recusados = computed(() =>
    respostas.value
        .filter(r => !r.confirmado)
        .reduce((total, r) => total + (r.nome_parceiro ? 2 : 1), 0)
)
</script>