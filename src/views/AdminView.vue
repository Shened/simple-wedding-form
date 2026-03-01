<template>
    <v-app>
        <v-main style="background: linear-gradient(135deg, #f5f0eb 0%, #ede0d4 100%); min-height: 100vh;">
            <v-container class="py-8">
                <!-- LOGIN -->
                <v-row v-if="!autenticado" justify="center" align="center" style="min-height: 90vh;">
                    <v-col cols="12" sm="8" md="4">
                        <v-card elevation="8" rounded="xl" class="pa-8">

                            <div class="text-center mb-6">
                                <div style="font-size: 2.5rem;">💍</div>
                                <div style="font-family: Georgia; font-size: 1.5rem; color: #7c5c3e;">
                                    Emanuela & Gilberto
                                </div>
                                <div style="color: #aaa; font-size: 0.9rem;">Área de Administração</div>
                            </div>

                            <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email"
                                variant="outlined" class="mb-3" />

                            <v-text-field v-model="senha" label="Password" type="password" prepend-inner-icon="mdi-lock"
                                variant="outlined" @keyup.enter="autenticar" />

                            <v-alert v-if="erroLogin" type="error" variant="tonal" class="mb-4">
                                Email ou password inválidos.
                            </v-alert>

                            <v-btn block size="large" rounded="xl" style="background: #7c5c3e; color: white;"
                                :loading="loadingLogin" @click="autenticar">
                                Entrar
                            </v-btn>

                        </v-card>
                    </v-col>
                </v-row>

                <!-- PAINEL -->
                <div v-else>

                    <!-- HEADER -->
                    <v-row align="center" class="mb-6">
                        <v-col>
                            <div style="font-family: Georgia; font-size: 1.6rem; color: #7c5c3e;">
                                💍 Emanuela & Gilberto
                            </div>
                            <div style="color: #aaa; font-size: 0.9rem;">
                                Painel de respostas
                            </div>
                        </v-col>

                        <v-col cols="auto">
                            <v-btn variant="outlined" color="#7c5c3e" rounded="xl" @click="logout">
                                <v-icon start>mdi-logout</v-icon>
                                Sair
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- LOADING -->
                    <v-row v-if="loadingDados" justify="center">
                        <v-progress-circular indeterminate color="#7c5c3e" size="40" />
                    </v-row>

                    <div v-else>

                        <!-- STATS -->
                        <v-row class="mb-6">
                            <v-col cols="12" sm="4">
                                <v-card rounded="xl" elevation="4" class="pa-5 text-center"
                                    style="background: #7c5c3e;">
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">
                                        {{ respostas.length }}
                                    </div>
                                    <div style="color: #f0e0cc;">Respostas recebidas</div>
                                </v-card>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-card rounded="xl" elevation="4" class="pa-5 text-center"
                                    style="background: #2e7d32;">
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">
                                        {{ confirmados }}
                                    </div>
                                    <div style="color: #c8e6c9;">Presenças confirmadas</div>
                                </v-card>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-card rounded="xl" elevation="4" class="pa-5 text-center"
                                    style="background: #c62828;">
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">
                                        {{ recusados }}
                                    </div>
                                    <div style="color: #ffcdd2;">Não comparecem</div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- TABELA -->
                        <v-card rounded="xl" elevation="4">
                            <v-card-title style="color: #7c5c3e; font-family: Georgia;">
                                Lista de respostas
                            </v-card-title>

                            <v-card-text>

                                <v-text-field v-model="pesquisa" label="Pesquisar..." prepend-inner-icon="mdi-magnify"
                                    variant="outlined" density="compact" class="mb-4" clearable />

                                <v-data-table :headers="headers" :items="respostas" :search="pesquisa"
                                    :items-per-page="10">

                                    <!-- Slot para coluna "Presença" -->
                                    <template #item.confirmado="{ item }">
                                        <v-chip :color="item.confirmado ? 'green' : 'red'" variant="tonal" rounded="xl"
                                            size="small">
                                            <v-icon start size="small">{{ item.confirmado ? 'mdi-check' : 'mdi-close'
                                                }}</v-icon>
                                            {{ item.confirmado ? 'Confirmado' : 'Não vai' }}
                                        </v-chip>
                                    </template>

                                    <!-- Slot para coluna "Parceiro" -->
                                    <template #item.nome_parceiro="{ item }">
                                        <span v-if="item.nome_parceiro">
                                            <v-icon size="small" color="#c9a96e">mdi-account-heart</v-icon>
                                            {{ item.nome_parceiro }}
                                        </span>
                                        <span v-else style="color: #ccc;">—</span>
                                    </template>

                                    <!-- Slot para coluna "Data" -->
                                    <template #item.criado_em="{ item }">
                                        <span style="color: #888; font-size: 0.85rem;">
                                            {{ new Date(item.criado_em).toLocaleDateString('pt-PT') }}
                                        </span>
                                    </template>

                                    <!-- Slot para coluna "Contacto" -->
                                    <template #item.contacto="{ item }">
                                        <a v-if="item.contacto" :href="`tel:${item.contacto}`"
                                            style="color: #7c5c3e; text-decoration: none;">
                                            <v-icon size="small" class="mr-1">mdi-phone</v-icon>{{ item.contacto }}
                                        </a>
                                        <span v-else style="color: #ccc;">—</span>
                                    </template>

                                    <template #item.total_pessoas="{ item }">
                                        <v-chip color="#7c5c3e" variant="tonal" size="small">
                                            👥 {{ item.total_pessoas }}
                                        </v-chip>
                                    </template>

                                    <template #item.acoes="{ item }">
                                        <v-btn icon color="red" variant="text" @click="eliminarResposta(item.id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </div>
                </div>

            </v-container>
            <v-container class="d-flex align-center justify-center" style="">
                <router-link to="/">
                    <v-btn class="home-button" variant="outlined" color="#7c5c3e" rounded="xl">
                        <v-icon start>mdi-arrow-left</v-icon>
                        Convite
                    </v-btn>
                </router-link>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const email = ref('')
const senha = ref('')
const autenticado = ref(false)
const erroLogin = ref(false)
const loadingLogin = ref(false)
const loadingDados = ref(false)

const respostas = ref([])
const pesquisa = ref('')

const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Parceiro/a', key: 'nome_parceiro' },
    { title: 'Contacto', key: 'contacto' },
    { title: 'Total Pessoas', key: 'total_pessoas' },
    { title: 'Presença', key: 'confirmado' },
    { title: 'Data', key: 'criado_em' },
    { title: 'Ações', key: 'acoes', sortable: false }
]

async function autenticar() {
    loadingLogin.value = true
    erroLogin.value = false

    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: senha.value
    })

    loadingLogin.value = false

    if (error) erroLogin.value = true
    else {
        autenticado.value = true
        carregarRespostas()
    }
}

async function logout() {
    await supabase.auth.signOut()
    autenticado.value = false
}

async function carregarRespostas() {
    loadingDados.value = true

    const { data } = await supabase
        .from('respostas')
        .select('*')
        .order('criado_em', { ascending: false })

    respostas.value = data || []
    loadingDados.value = false
}

onMounted(async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
        autenticado.value = true
        carregarRespostas()
    }
})

/* 🔥 CONTADORES NOVOS */

const confirmados = computed(() =>
    respostas.value
        .filter(r => r.confirmado)
        .reduce((t, r) => t + (r.total_pessoas || 0), 0)
)

const recusados = computed(() =>
    respostas.value
        .filter(r => !r.confirmado)
        .reduce((t, r) => t + (r.total_pessoas || 0), 0)
)

async function eliminarResposta(id) {
    const confirmar = confirm('Tens a certeza que queres eliminar esta resposta?')
    if (!confirmar) return

    const { error } = await supabase
        .from('respostas')
        .delete()
        .eq('id', id)

    if (!error) {
        respostas.value = respostas.value.filter(r => r.id !== id)
    } else {
        alert('Erro ao eliminar')
    }
}
</script>

<style>
.home-button {
    /* position: absolute;
    top: 20px;
    left: 20px; */
    z-index: 10;
    color: #fff;
}
</style>