import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { profileService } from '@/services/profile'
import { Loader2, User } from 'lucide-react'
import { Profile as ProfileType } from '@/types/db'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  profession: z.string().optional(),
  time_in_company: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  existing_diseases: z.string().optional(),
  medications: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  ai_data_consent: z.boolean().default(true),
  emergency_notification_consent: z.boolean().default(false),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileType | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      profession: '',
      time_in_company: '',
      date_of_birth: '',
      gender: '',
      existing_diseases: '',
      medications: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      ai_data_consent: true,
      emergency_notification_consent: false,
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile()
        setProfileData(profile)
        form.reset({
          name: profile.name || '',
          profession: profile.profession || '',
          time_in_company: profile.time_in_company || '',
          date_of_birth: profile.date_of_birth || '',
          gender: profile.gender || '',
          existing_diseases: profile.existing_diseases || '',
          medications: profile.medications || '',
          emergency_contact_name: profile.emergency_contact_name || '',
          emergency_contact_phone: profile.emergency_contact_phone || '',
          ai_data_consent: profile.ai_data_consent,
          emergency_notification_consent:
            profile.emergency_notification_consent || false,
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar seu perfil.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [form, toast])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true)
    try {
      await profileService.updateProfile(data)
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      })
      // Refresh profile data to update UI if needed
      const updatedProfile = await profileService.getProfile()
      setProfileData(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-8 pt-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md">
            <AvatarImage src={profileData?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-display">
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Seus dados básicos e profissionais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Desenvolvedor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time_in_company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 2 anos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                            <SelectItem value="prefer_not_to_say">
                              Prefiro não dizer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Saúde</CardTitle>
                <CardDescription>
                  Dados importantes para personalizar suas recomendações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="existing_diseases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições de Saúde Pré-existentes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liste quaisquer condições de saúde relevantes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicamentos em Uso</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liste os medicamentos que você toma regularmente..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato de Emergência</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do contato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergency_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de Emergência</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacidade e Consentimento</CardTitle>
                <CardDescription>
                  Gerencie como seus dados são utilizados pela IA e preferências
                  de contato.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="ai_data_consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Consentimento para Dados de IA
                        </FormLabel>
                        <FormDescription>
                          Permitir que a CalmIA utilize seus dados anonimizados
                          para melhorar as recomendações.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_notification_consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notificações SMS de Emergência
                        </FormLabel>
                        <FormDescription>
                          Permitir envio de SMS para seu contato de emergência
                          caso um sentimento crítico seja detectado.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
