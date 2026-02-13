import { prisma } from '@/lib/db';
import { updateCar } from '../../actions';
import CarForm from '@/components/admin/CarForm';
import { notFound } from 'next/navigation';

interface EditCarPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
    const { id } = await params;
    const car = await prisma.car.findUnique({
        where: { id },
        include: {
            translations: {
                where: { locale: 'ar' },
            },
        },
    });

    if (!car) {
        notFound();
    }

    const arabicTranslation = car.translations[0];
    const initialData = {
        ...car,
        makeAr: arabicTranslation?.make || undefined,
        modelAr: arabicTranslation?.model || undefined,
        descriptionAr: arabicTranslation?.description || undefined,
    };

    const updateCarWithId = updateCar.bind(null, car.id);

    return (
        <CarForm
            initialData={initialData}
            action={updateCarWithId}
            title="Edit Car"
        />
    );
}
