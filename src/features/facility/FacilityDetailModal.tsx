import React from 'react';
import { useFacilityDetail, useTransports } from '@/lib/api-hooks';
import { Input } from '@/components/ui/input';
import InputDate from '@/components/ui/input-date';
import InputFile from '@/components/ui/input-file';
import { Button } from '@/components/ui/button';
import Select from '@/components/ui/select';
import { uploadSingleFile, saveSingleFile } from '@/lib/api';
import { X } from 'lucide-react';

interface FacilityDetailModalProps {
  open: boolean;
  onClose: () => void;
  facilityId: number | null;
}

// 날짜 포맷 변환 함수
const toDashDate = (str: string) => {
  if (!str) return '';
  
  // 6자리 문자열 (yyyymm)을 yyyy-mm으로 변환
  if (str.length === 6) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}`;
  }
  
  // 8자리 문자열 (yyyymmdd)을 yyyy-mm-dd로 변환
  if (str.length === 8) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }
  
  return str;
}
const toYYYYMMDD = (str: string) => str?.replace(/-/g, '')

export default function FacilityDetailModal({ open, onClose, facilityId }: FacilityDetailModalProps) {
  const { data: facility, isLoading, error } = useFacilityDetail(facilityId || 0);
  
  // 운수사 목록 조회
  const { data: transportsData } = useTransports(0, 1000); // 전체 목록 조회

  // 상태 관리
  const [chargingDevices, setChargingDevices] = React.useState<any[]>([]);
  const [fileUploads, setFileUploads] = React.useState<{[key: string]: any}>({});
  const [fileChanged, setFileChanged] = React.useState<{[key: string]: boolean}>({});
  const [fullAddress, setFullAddress] = React.useState('');
  const [selectedTransportCompanyId, setSelectedTransportCompanyId] = React.useState<string>('');

  React.useEffect(() => {
    if (facility) {
      setChargingDevices(facility.chargingDevices || []);
      setFullAddress(facility.fullAddress || '');
      
      // chargingStationId와 transportCompanyId가 일치하므로 그대로 사용
      if (facility.chargingStationId) {
        setSelectedTransportCompanyId(facility.chargingStationId.toString());
      } else {
        // fallback: 기본값 설정
        setSelectedTransportCompanyId('1');
      }
    }
  }, [facility]);

  // 차고지 주소 변경 핸들러
  const handleAddressChange = (value: string) => {
    setFullAddress(value);
  };

  // 운수사 변경 핸들러
  const handleTransportCompanyChange = (value: string) => {
    setSelectedTransportCompanyId(value);
  };

  // 제조번호 변경 핸들러
  const handleSerialNumberChange = (deviceIdx: number, chargerIdx: number | null, value: string) => {
    const newDevices = [...chargingDevices];
    if (chargerIdx !== null) {
      // 충전설비 제조번호
      newDevices[deviceIdx].chargers[chargerIdx].serialNumber = value;
    } else {
      // AC전력량계 제조번호
      newDevices[deviceIdx].serialNumber = value;
    }
    setChargingDevices(newDevices);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (deviceIdx: number, chargerIdx: number | null, value: string) => {
    const newDevices = [...chargingDevices];
    if (chargerIdx !== null) {
      // 충전설비 제조년월
      newDevices[deviceIdx].chargers[chargerIdx].manufactureDate = toYYYYMMDD(value);
    } else {
      // AC전력량계 제조년월
      newDevices[deviceIdx].manufactureDate = toYYYYMMDD(value);
    }
    setChargingDevices(newDevices);
  };

  // 파일 업로드 핸들러
  const handleFileChange = async (deviceIdx: number, chargerIdx: number | null, fileType: string, file: File) => {
    const res = await uploadSingleFile(file);
    const key = `${deviceIdx}_${chargerIdx}_${fileType}`;
    setFileUploads(prev => ({ ...prev, [key]: res.data }));
    setFileChanged(prev => ({ ...prev, [key]: true }));
  };

  // 파일 삭제 핸들러 (상태관리에서만 제거)
  const handleFileDelete = (deviceIdx: number, chargerIdx: number | null, fileType: string) => {
    const key = `${deviceIdx}_${chargerIdx}_${fileType}`;
    setFileUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[key];
      return newUploads;
    });
    setFileChanged(prev => {
      const newChanged = { ...prev };
      delete newChanged[key];
      return newChanged;
    });
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 파일 저장 로직
      const files = [];
      for (const [key, upload] of Object.entries(fileUploads)) {
        if (fileChanged[key]) {
          const [deviceIdx, chargerIdx, fileType] = key.split('_');
          const res = await saveSingleFile({
            uploadDirPath: 'facility',
            ...upload,
          });
          if (res?.data?.attachFileId) {
            files.push({
              attachFileId: res.data.attachFileId,
              fileType: fileType,
              file: res.data,
            });
          }
        }
      }

      // 설비 정보 업데이트 로직 (API 호출)
      // TODO: 실제 API 호출 구현
      console.log('설비 정보 업데이트:', { 
        fullAddress, 
        transportCompanyId: selectedTransportCompanyId, 
        chargingDevices, 
        files 
      });
      
      onClose();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  // 운수사 옵션 생성
  const transportOptions = transportsData?.data?.content?.map((transport: any) => ({
    value: transport.transportCompanyId.toString(),
    label: transport.companyName,
  })) || [];

  if (!open || !facilityId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end items-stretch">
        <div className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end items-stretch">
        <div className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-500">차고지 정보를 찾을 수 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch">
      {/* BG */}
      <div
        className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-[20px] font-medium text-[#141C25] leading-7 font-inter">설비 상세정보</div>
          <button
            className="p-2 bg-[#F2F4F7] rounded-lg flex items-center justify-center"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-[#141C25]" />
          </button>
        </div>
        
        {/* List */}
        <div className="flex flex-col gap-6">
          {/* 차고지/운수사 */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">차고지</label>
              <Input 
                value={fullAddress} 
                onChange={(e) => handleAddressChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 h-16">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">운수사</label>
              <Select
                options={transportOptions}
                value={selectedTransportCompanyId}
                onValueChange={handleTransportCompanyChange}
                placeholder="운수사 선택"
              />
            </div>
          </div>
          
          {/* 구분선 */}
          <div className="w-full h-0 border-t border-[#e4e7ec]"></div>
          
          {/* AC전력량계 및 충전설비 */}
          {chargingDevices?.map((device: any, deviceIdx: number) => (
            <div key={deviceIdx} className="flex flex-col gap-6">
              {/* AC전력량계 */}
              <div className="flex gap-6">
                <div className="flex-1 flex gap-5">
                  <div className="flex-1">
                    <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">AC전력량계 제조번호</label>
                    <Input 
                      value={device.serialNumber} 
                      onChange={(e) => handleSerialNumberChange(deviceIdx, null, e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">제조년월</label>
                    <InputDate 
                      value={toDashDate(device.manufactureDate || '')} 
                      onChange={(e) => handleDateChange(deviceIdx, null, e.target.value)} 
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <InputFile
                    label="AC전력량계 이미지"
                    value={device.powerMeterFile ? { name: device.powerMeterFile.originalFileName } : 
                           fileUploads[`${deviceIdx}_null_powerMeter`] ? { name: fileUploads[`${deviceIdx}_null_powerMeter`].originalFileName } : null}
                    onChange={(file) => handleFileChange(deviceIdx, null, 'powerMeter', file)}
                    onDelete={() => handleFileDelete(deviceIdx, null, 'powerMeter')}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* 충전설비 */}
              {device.chargers?.map((charger: any, chargerIdx: number) => (
                <div className="flex gap-6" key={chargerIdx}>
                  <div className="flex-1 flex gap-5">
                    <div className="flex-1">
                      <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조번호</label>
                      <Input 
                        value={charger.serialNumber} 
                        onChange={(e) => handleSerialNumberChange(deviceIdx, chargerIdx, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조년월</label>
                      <InputDate 
                        value={toDashDate(charger.manufactureDate || '')} 
                        onChange={(e) => handleDateChange(deviceIdx, chargerIdx, e.target.value)} 
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <InputFile
                      label="충전설비동판 이미지"
                      value={charger.chargerFile ? { name: charger.chargerFile.originalFileName } : 
                             fileUploads[`${deviceIdx}_${chargerIdx}_charger`] ? { name: fileUploads[`${deviceIdx}_${chargerIdx}_charger`].originalFileName } : null}
                      onChange={(file) => handleFileChange(deviceIdx, chargerIdx, 'charger', file)}
                      onDelete={() => handleFileDelete(deviceIdx, chargerIdx, 'charger')}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {/* 충전설비 추가 버튼 */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]">
            <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
            충전설비 추가
          </button>
          
          {/* 구분선 */}
          <div className="w-full h-0 border-t border-[#e4e7ec]"></div>
          
          {/* AC전력량계 추가 버튼 */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]">
            <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
            AC전력량계 추가
          </button>
        </div>
        
        {/* 하단 CTA */}
        <div className="mt-auto pt-6">
          <Button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#141C25] text-white rounded-[10px] font-medium text-[14px] shadow"
          >
            수정
          </Button>
        </div>
      </div>
    </div>
  );
} 