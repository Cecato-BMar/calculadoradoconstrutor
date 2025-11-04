import { Crown, Check, X, FileDown, History, FileText, Headphones } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PremiumModal({ open, onClose, onUpgrade }: PremiumModalProps) {
  const features = [
    {
      icon: FileDown,
      title: 'Exportação PDF Ilimitada',
      description: 'Exporte orçamentos profissionais em PDF sem limites',
      premium: true,
    },
    {
      icon: History,
      title: 'Histórico de Projetos',
      description: 'Acesse todos os seus orçamentos anteriores',
      premium: true,
    },
    {
      icon: FileText,
      title: 'Templates Personalizados',
      description: 'Crie modelos de orçamento com sua marca',
      premium: true,
    },
    {
      icon: Headphones,
      title: 'Suporte Prioritário',
      description: 'Atendimento rápido via WhatsApp',
      premium: true,
    },
  ];

  const plans = [
    {
      name: 'Grátis',
      price: 0,
      period: 'sempre',
      features: [
        'Calculadoras básicas',
        'Até 5 orçamentos/mês',
        'Suporte por email',
      ],
      notIncluded: [
        'Exportação PDF',
        'Histórico completo',
        'Templates personalizados',
      ],
      buttonText: 'Plano Atual',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: 29.90,
      period: 'mês',
      features: [
        'Todas as calculadoras',
        'Orçamentos ilimitados',
        'Exportação PDF profissional',
        'Histórico completo',
        'Templates personalizados',
        'Suporte prioritário',
        'Atualizações exclusivas',
      ],
      notIncluded: [],
      buttonText: 'Assinar Agora',
      highlighted: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl">Upgrade para Premium</DialogTitle>
          </div>
          <DialogDescription>
            Desbloqueie todo o potencial do ObraCalc Pro e turbine seus orçamentos
          </DialogDescription>
        </DialogHeader>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? 'border-2 border-amber-500 shadow-lg'
                  : 'border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    Recomendado
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl text-slate-900">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-slate-600">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={plan.highlighted ? onUpgrade : undefined}
                  disabled={!plan.highlighted}
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-900">
            💡 <strong>Demonstração:</strong> Este é um exemplo de sistema de monetização. 
            Em produção, seria integrado com um gateway de pagamento real.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
