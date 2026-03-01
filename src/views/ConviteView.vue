<template>
    <v-app>
        <v-main style="background: linear-gradient(135deg, #f5f0eb 0%, #ede0d4 100%); min-height: 100vh;">
            <router-link to="/admin">
                <v-btn class="admin-button" variant="outlined" color="#7c5c3e" rounded="xl">
                    <v-icon start>mdi-wrench</v-icon>
                    Dashboard
                </v-btn>
            </router-link>
            <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
                <v-card max-width="520" width="100%" elevation="8" rounded="xl" class="pa-6">

                    <v-card-title class="text-center flex-column d-flex align-center pb-0">
                        <!-- <div style="font-size: 2.5rem;">💍</div> -->
                        <div style="font-family: 'Georgia', serif; font-size: 1.8rem; color: #7c5c3e;">
                            Emanuela & Gilberto
                        </div>
                        <v-divider class="my-2"
                            style="width: 60px; border-color: #c9a96e; border-width: 2px;"></v-divider>
                    </v-card-title>

                    <v-card-subtitle class="text-center pb-2" style="font-size: 1rem; color: #6d6d6d;">
                        <p class="mb-2" style="font-weight: bold; color: rgb(124, 92, 62);">
                            Confirmem a vossa presença no nosso casamento!
                        </p>
                        <span style="font-size: 1.2rem;">📅 <b>31 de Julho de 2026</b></span>
                    </v-card-subtitle>

                    <!-- Local da Igreja e da Festa -->
                    <v-row class="px-4 pb-2 pt-3" justify="center">
                        <v-col cols="12" sm="6">
                            <v-card rounded="xl" variant="tonal" color="#7c5c3e" class="pa-3 text-center">
                                <div style="font-size: 1.3rem;">⛪</div>
                                <div style="font-weight: bold; color: #7c5c3e; font-size: 0.9rem;">Igreja</div>
                                <div style="font-weight: bold; font-size: 0.85rem; color: #555;">Igreja Paroquial
                                    Jovim<br>14:30</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-card rounded="xl" variant="tonal" color="#7c5c3e" class="pa-3 text-center">
                                <div style="font-size: 1.3rem;">🥂</div>
                                <div style="font-weight: bold; color: #7c5c3e; font-size: 0.9rem;">Festa</div>
                                <div style="font-weight: bold; font-size: 0.85rem; color: #555;">Quinta do
                                    Pinhal<br>Jovim</div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-card-text v-if="!enviado">
                        <v-form @submit.prevent="enviar">
                            <v-text-field v-model="nome" label="O teu nome" prepend-inner-icon="mdi-account"
                                variant="outlined" rounded required class="mb-1" color="#7c5c3e" />

                            <v-text-field v-model="nomeParceiro" label="Nome do/a parceiro/a (opcional)"
                                prepend-inner-icon="mdi-account-heart" variant="outlined" rounded class="mb-1"
                                color="#7c5c3e" />

                            <v-text-field v-model="contacto" label="O teu contacto" prepend-inner-icon="mdi-phone"
                                variant="outlined" rounded required class="mb-1" color="#7c5c3e" type="tel"
                                :rules="[v => /^[0-9]{9}$/.test(v) || 'Introduz um número válido com 9 dígitos']" />

                            <v-row class="mb-1" no-gutters>
                                <v-col cols="6" class="pr-2">
                                    <v-btn block size="large" rounded="xl" :loading="loading && confirmado === true"
                                        :variant="confirmado === true ? 'flat' : 'outlined'" :style="confirmado === true
                                            ? 'background: #2e7d32; color: white; border: 2px solid #2e7d32;'
                                            : 'color: #2e7d32; border: 2px solid #2e7d32;'" @click="submeter(true)">
                                        <v-icon start>mdi-check-circle</v-icon>
                                        Sim, vou!
                                    </v-btn>
                                </v-col>
                                <v-col cols="6" class="pl-2">
                                    <v-btn block size="large" rounded="xl" :loading="loading && confirmado === false"
                                        :variant="confirmado === false ? 'flat' : 'outlined'" :style="confirmado === false
                                            ? 'background: #c62828; color: white; border: 2px solid #c62828;'
                                            : 'color: #c62828; border: 2px solid #c62828;'" @click="submeter(false)">
                                        <v-icon start>mdi-close-circle</v-icon>
                                        Não posso
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <v-row justify="center" class="">
                                <span style="font-size: 0.9rem;">
                                    <p class="mb-1"
                                        style="justify-content: center; display: flex; color: #555; font-weight: bold;">
                                        Por favor, confirma a tua presença até ao dia 30 de julho.</p>
                                    <p class="mb-0"
                                        style="justify-content: center; display: flex; color: #555; font-weight: bold;">
                                        Obrigado! 🙏</p>
                                </span>
                            </v-row>

                            <v-alert v-if="erro" type="error" variant="tonal" rounded="lg" class="mb-3">
                                {{ erro }}
                            </v-alert>
                        </v-form>
                    </v-card-text>

                    <v-card-text v-else class="text-center py-8">
                        <div style="font-size: 3rem;">🎉</div>
                        <p style="font-size: 1.3rem; color: #7c5c3e; font-family: Georgia, serif;">
                            Obrigado, {{ nome }}!
                        </p>
                        <p style="color: #777;">A tua resposta foi registada com sucesso.</p>
                    </v-card-text>

                    <!-- Footer com contactos -->
                    <v-divider class="mx-6 mt-2"></v-divider>
                    <v-card-text class="text-center pb-4 pt-3">
                        <p style="font-size: 0.8rem; color: #999; margin-bottom: 8px;">Para mais informações,
                            contacta-nos:</p>
                        <v-row justify="center" no-gutters>
                            <v-col cols="12" sm="6" class="d-flex justify-center align-center mb-1">
                                <v-icon size="small" color="#7c5c3e" class="mr-1">mdi-phone</v-icon>
                                <span style="font-size: 0.85rem; color: #7c5c3e; font-weight: bold;">Emanuela</span>
                                <a href="tel:910000001"
                                    style="font-size: 0.85rem; color: #555; text-decoration: none; margin-left: 6px;">
                                    939 902 412
                                </a>
                            </v-col>
                            <v-col cols="12" sm="6" class="d-flex justify-center align-center mb-1">
                                <v-icon size="small" color="#7c5c3e" class="mr-1">mdi-phone</v-icon>
                                <span style="font-size: 0.85rem; color: #7c5c3e; font-weight: bold;">Gilberto</span>
                                <a href="tel:910000002"
                                    style="font-size: 0.85rem; color: #555; text-decoration: none; margin-left: 6px;">
                                    965 134 899
                                </a>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const nome = ref('')
const nomeParceiro = ref('')
const confirmado = ref(null)
const loading = ref(false)
const enviado = ref(false)
const erro = ref('')
const contacto = ref('')

async function submeter(valor) {
    if (!nome.value.trim()) {
        erro.value = 'Por favor indica o teu nome.'
        return
    }
    confirmado.value = valor
    loading.value = true
    erro.value = ''

    const { error } = await supabase.from('respostas').insert({
        nome: nome.value,
        nome_parceiro: nomeParceiro.value || null,
        confirmado: valor,
        contacto: contacto.value  // ← adiciona esta linha
    })

    if (error) {
        erro.value = 'Ocorreu um erro. Tenta novamente.'
    } else {
        enviado.value = true
    }
    loading.value = false
}
</script>

<style>
.admin-button {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    color: #fff;
}
</style>