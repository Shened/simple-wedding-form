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
                            <div style="color: #aaa; font-size: 0.9rem;">Painel de respostas</div>
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
                                    <v-icon size="32" color="white" class="mb-2">mdi-email-check</v-icon>
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ respostas.length
                                    }}</div>
                                    <div style="color: #f0e0cc;">Respostas recebidas</div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-card rounded="xl" elevation="4" class="pa-5 text-center"
                                    style="background: #2e7d32;">
                                    <v-icon size="32" color="white" class="mb-2">mdi-check-circle</v-icon>
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ confirmados }}
                                    </div>
                                    <div style="color: #c8e6c9;">Presenças confirmadas</div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-card rounded="xl" elevation="4" class="pa-5 text-center"
                                    style="background: #c62828;">
                                    <v-icon size="32" color="white" class="mb-2">mdi-close-circle</v-icon>
                                    <div style="font-size: 2.2rem; font-weight: bold; color: white;">{{ recusados }}
                                    </div>
                                    <div style="color: #ffcdd2;">Não comparecem</div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- TABELA -->
                        <v-card rounded="xl" elevation="4">
                            <v-card-title class="pa-5 pb-0" style="color: #7c5c3e; font-family: Georgia;">
                                <v-icon color="#7c5c3e" class="mr-2">mdi-format-list-bulleted</v-icon>
                                Lista de respostas
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <v-text-field v-model="pesquisa" label="Pesquisar..." prepend-inner-icon="mdi-magnify"
                                    variant="outlined" density="compact" class="mb-4" clearable />

                                <v-data-table :headers="headers" :items="respostas" :search="pesquisa"
                                    :items-per-page="10" item-value="id">

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

                                    <template #item.total_pessoas="{ item }">
                                        <v-chip color="#7c5c3e" variant="tonal" size="small">
                                            👥 {{ item.total_pessoas }}
                                        </v-chip>
                                    </template>

                                    <template #item.acoes="{ item }">
                                        <v-btn icon variant="text" color="#7c5c3e" @click="abrirModal(item)">
                                            <v-icon>mdi-information-outline</v-icon>
                                        </v-btn>
                                        <v-btn icon variant="text" color="red" @click="eliminarResposta(item.id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>

                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </div>
                </div>
            </v-container>

            <!-- BOTÃO VOLTAR -->
            <v-container class="d-flex align-center justify-center">
                <router-link to="/">
                    <v-btn variant="outlined" color="#7c5c3e" rounded="xl">
                        <v-icon start>mdi-arrow-left</v-icon>
                        Convite
                    </v-btn>
                </router-link>
            </v-container>

            <!-- MODAL DETALHE -->
            <v-dialog v-model="modal" max-width="480">
                <v-card rounded="xl" class="pa-4" v-if="selecionado">

                    <v-card-title class="d-flex align-center justify-space-between">
                        <span style="font-family: Georgia; color: #7c5c3e;">
                            <v-icon color="#7c5c3e" class="mr-1">mdi-account</v-icon>
                            {{ selecionado.nome }}
                        </span>
                        <v-chip :color="selecionado.confirmado ? 'green' : 'red'" variant="tonal" size="small">
                            {{ selecionado.confirmado ? '✅ Confirmado' : '❌ Não vai' }}
                        </v-chip>
                    </v-card-title>

                    <v-divider class="my-3"></v-divider>

                    <v-card-text class="pa-2">
                        <v-list density="compact">

                            <v-list-item prepend-icon="mdi-account-heart" title="Parceiro/a">
                                <template #append>
                                    <span style="color: #555;">{{ selecionado.nome_parceiro || '—' }}</span>
                                </template>
                            </v-list-item>

                            <v-list-item prepend-icon="mdi-phone" title="Contacto">
                                <template #append>
                                    <a v-if="selecionado.contacto" :href="`tel:${selecionado.contacto}`"
                                        style="color: #7c5c3e; text-decoration: none;">
                                        {{ selecionado.contacto }}
                                    </a>
                                    <span v-else style="color: #ccc;">—</span>
                                </template>
                            </v-list-item>

                            <v-list-item prepend-icon="mdi-account-group" title="Total de pessoas">
                                <template #append>
                                    <v-chip color="#7c5c3e" variant="tonal" size="small">
                                        👥 {{ selecionado.total_pessoas }}
                                    </v-chip>
                                </template>
                            </v-list-item>

                            <v-list-item prepend-icon="mdi-calendar" title="Data de resposta">
                                <template #append>
                                    <span style="color: #888;">
                                        {{ new Date(selecionado.criado_em).toLocaleDateString('pt-PT') }}
                                    </span>
                                </template>
                            </v-list-item>

                        </v-list>

                        <!-- CRIANÇAS -->
                        <div v-if="selecionado.filhos && selecionado.filhos.length" class="mt-3">
                            <div class="d-flex align-center mb-2">
                                <v-icon color="#7c5c3e" class="mr-2">mdi-baby-face</v-icon>
                                <span style="font-weight: bold; color: #7c5c3e;">Crianças</span>
                            </div>
                            <v-chip v-for="(filho, i) in selecionado.filhos" :key="i" variant="tonal" color="#7c5c3e"
                                class="mr-2 mb-2">
                                🧒 {{ filho.nome }} — {{ filho.idade }} anos
                            </v-chip>
                        </div>
                        <div v-else class="mt-3 d-flex align-center">
                            <v-icon color="#ccc" class="mr-2">mdi-baby-face-outline</v-icon>
                            <span style="color: #aaa; font-size: 0.9rem;">Sem crianças</span>
                        </div>
                    </v-card-text>

                    <v-card-actions class="justify-end pt-0">
                        <v-btn variant="tonal" color="#7c5c3e" rounded="xl" @click="modal = false">Fechar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
const modal = ref(false)
const selecionado = ref(null)

const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Parceiro/a', key: 'nome_parceiro' },
    { title: 'Contacto', key: 'contacto' },
    { title: 'Total', key: 'total_pessoas' },
    { title: 'Presença', key: 'confirmado' },
    { title: 'Data', key: 'criado_em' },
    { title: '', key: 'acoes', sortable: false }
]

function abrirModal(item) {
    selecionado.value = item
    modal.value = true
}

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
    const { error } = await supabase.from('respostas').delete().eq('id', id)
    if (!error) {
        respostas.value = respostas.value.filter(r => r.id !== id)
        if (selecionado.value?.id === id) modal.value = false
    } else {
        alert('Erro ao eliminar')
    }
}
</script>