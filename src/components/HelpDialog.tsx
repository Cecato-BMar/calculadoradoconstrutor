import { HelpCircle, Calculator, Square, Hammer, Paintbrush, Home as HomeIcon, Droplet, FileText, Crown, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Central de Ajuda
          </DialogTitle>
          <DialogDescription>
            Aprenda a usar todas as funcionalidades do ObraCalc Pro
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="guide" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">
              <BookOpen className="w-4 h-4 mr-2" />
              Guia Rápido
            </TabsTrigger>
            <TabsTrigger value="calculators">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadoras
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Guia Rápido */}
          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Como usar o ObraCalc Pro</CardTitle>
                <CardDescription>
                  Siga este guia passo a passo para criar seus orçamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="mb-1">Escolha uma Calculadora</h4>
                      <p className="text-sm text-slate-600">
                        Na aba "Calculadoras", selecione o tipo de material que deseja calcular (Alvenaria, Concreto, Pisos, Pintura, Cobertura, Reboco ou Impermeabilização).
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="mb-1">Preencha as Dimensões</h4>
                      <p className="text-sm text-slate-600">
                        Insira as medidas da área (comprimento, largura, altura) conforme solicitado pela calculadora. Cada tipo de material tem campos específicos.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h4 className="mb-1">Configure Preços e Mão de Obra</h4>
                      <p className="text-sm text-slate-600">
                        Ajuste os preços unitários dos materiais e, opcionalmente, adicione o custo da mão de obra para ter um orçamento completo.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <h4 className="mb-1">Calcule e Revise</h4>
                      <p className="text-sm text-slate-600">
                        Clique em "Calcular" para ver a prévia do resultado com quantidade de materiais e custos totais.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      5
                    </div>
                    <div>
                      <h4 className="mb-1">Adicione ao Orçamento</h4>
                      <p className="text-sm text-slate-600">
                        Se o cálculo estiver correto, clique em "Adicionar ao Orçamento" para incluir no seu projeto.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      6
                    </div>
                    <div>
                      <h4 className="mb-1">Exporte seu Orçamento</h4>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        Na aba "Orçamento", visualize todos os itens e exporte em PDF 
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculadoras */}
          <TabsContent value="calculators" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="alvenaria">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-orange-600" />
                    <span>Alvenaria</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular blocos/tijolos, cimento e areia para construção de paredes.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Comprimento da parede (metros)</li>
                    <li>Altura da parede (metros)</li>
                    <li>Tipo de bloco (cerâmico, concreto, tijolo maciço)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Blocos/Tijolos, Cimento, Areia</p>
                  <p className="text-slate-600 italic">
                    Dica: O cálculo já inclui 10% de margem de segurança para perdas.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="concreto">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-slate-600" />
                    <span>Concreto</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular materiais para lajes, vigas e pilares.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Comprimento (metros)</li>
                    <li>Largura (metros)</li>
                    <li>Espessura/Altura (metros)</li>
                    <li>Tipo de estrutura (laje, viga, pilar)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Cimento, Areia, Brita, Ferro</p>
                  <p className="text-slate-600 italic">
                    Dica: Para concreto estrutural, considere sempre um traço adequado à resistência necessária.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pisos">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 text-amber-600" />
                    <span>Pisos e Revestimentos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular pisos cerâmicos, porcelanatos e revestimentos.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Comprimento da área (metros)</li>
                    <li>Largura da área (metros)</li>
                    <li>Dimensões do piso (cm)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Pisos/Cerâmicas, Argamassa, Rejunte</p>
                  <p className="text-slate-600 italic">
                    Dica: Inclui automaticamente 10% para recortes e quebras.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pintura">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Paintbrush className="w-5 h-5 text-blue-600" />
                    <span>Pintura</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular quantidade de tinta e complementos.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Área total a pintar (m²)</li>
                    <li>Número de demãos</li>
                    <li>Tipo de tinta (látex, acrílica, esmalte)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Tinta, Primer/Selador, Massa Corrida</p>
                  <p className="text-slate-600 italic">
                    Dica: Considere o rendimento médio de 10m²/L para látex e acrílica.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cobertura">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 text-red-600" />
                    <span>Cobertura</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular telhas e estrutura de telhado.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Comprimento do telhado (metros)</li>
                    <li>Largura do telhado (metros)</li>
                    <li>Tipo de telha (cerâmica, fibrocimento, metálica)</li>
                    <li>Inclinação (graus ou percentual)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Telhas, Madeiramento, Cumeeiras</p>
                  <p className="text-slate-600 italic">
                    Dica: A inclinação afeta diretamente a área do telhado e quantidade de materiais.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reboco">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-slate-500" />
                    <span>Reboco e Chapisco</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular materiais para revestimento de paredes.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Área total das paredes (m²)</li>
                    <li>Espessura do reboco (cm)</li>
                    <li>Tipo de acabamento (chapisco, emboço, reboco)</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Cimento, Areia, Cal</p>
                  <p className="text-slate-600 italic">
                    Dica: Espessura padrão de reboco é de 2 a 3cm.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="impermeabilizacao">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-500" />
                    <span>Impermeabilização</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p><strong>Uso:</strong> Calcular produtos para impermeabilização de lajes e áreas úmidas.</p>
                  <p><strong>Campos necessários:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Área a impermeabilizar (m²)</li>
                    <li>Tipo de impermeabilizante (manta, emulsão, cristalizante)</li>
                    <li>Número de camadas</li>
                  </ul>
                  <p><strong>Materiais calculados:</strong> Impermeabilizante, Primer, Selante</p>
                  <p className="text-slate-600 italic">
                    Dica: Áreas críticas como banheiros requerem atenção especial aos rodapés.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>Como funciona a assinatura Premium?</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>
                    A assinatura Premium desbloqueia recursos avançados como:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Exportação de orçamentos em PDF profissional</li>
                    <li>Histórico ilimitado de projetos</li>
                    <li>Modelos de orçamento personalizados</li>
                    <li>Suporte prioritário</li>
                    <li>Acesso a novas funcionalidades em primeira mão</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>Os cálculos são precisos?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Sim! Todas as calculadoras usam fórmulas técnicas baseadas em normas da construção civil 
                    e incluem margens de segurança padrão da indústria (geralmente 10%) para compensar 
                    perdas, quebras e cortes. No entanto, sempre recomendamos consultar um profissional 
                    para projetos grandes ou complexos.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>Posso editar os preços dos materiais?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Sim! Todos os preços são editáveis e você pode ajustá-los de acordo com os valores 
                    praticados na sua região. Os preços padrão são apenas sugestões baseadas em médias 
                    de mercado.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>Como adiciono mão de obra ao orçamento?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Em cada calculadora, há um campo opcional "Valor de Mão de Obra" onde você pode 
                    inserir o custo do serviço. Este valor será somado ao custo dos materiais no total 
                    final do orçamento.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>Posso usar o app offline?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Atualmente, o ObraCalc Pro requer conexão com a internet para funcionar. 
                    Estamos trabalhando em uma versão offline que estará disponível em breve 
                    para assinantes Premium.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>Como faço para compartilhar um orçamento?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Com a assinatura Premium, você pode exportar seus orçamentos em PDF e 
                    compartilhá-los por e-mail, WhatsApp ou qualquer outro meio. O PDF inclui 
                    todos os detalhes, materiais e custos de forma profissional.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q7">
                <AccordionTrigger>Posso salvar múltiplos projetos?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Sim! Você pode trabalhar em múltiplos orçamentos simultaneamente. Cada orçamento 
                    pode ter um nome personalizado para facilitar a organização. Assinantes Premium 
                    têm acesso a histórico completo de todos os projetos.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Card className="bg-blue-50 border-blue-200 mt-6">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-1 text-blue-900">Ainda tem dúvidas?</h4>
                    <p className="text-sm text-blue-700">
                      Entre em contato conosco através do e-mail: suporte@obracalcpro.com.br
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
